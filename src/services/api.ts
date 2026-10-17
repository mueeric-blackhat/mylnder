
import type { MyinderSubmission, School } from "../types/myinder";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BATCH_SIZE = 4;
const MAX_UPLOAD_RETRIES = 2;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Keep the short-lived checkout token in memory.
// Never store this credential in localStorage.

export interface CreateUserResponse {
  user_id: string;
  checkout_token: string;
  checkout_token_id: string;
  expires_at: string;
  photos: string[];
}

export interface Plan {
  id: string;
  name: string;
  // The backend returns major currency units, e.g. "10.00".
  amount: string | number;
  currency: string;
  is_active: boolean;
  is_current: boolean;
}

// The frontend needs only the hosted checkout URL.
// Payment IDs and Stripe session IDs are not required for redirection.
export interface CheckoutResponse {
  checkoutUrl: string;
}

type ApiErrorBody = {
  message?: unknown;
  error?: unknown;
  response?: {
    message?: unknown;
  };
};

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const rawBody = await response.text();

  let data: unknown = {};

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = { message: rawBody };
    }
  }

  if (!response.ok) {
    const body =
      data && typeof data === "object"
        ? (data as ApiErrorBody)
        : {};

    const message =
      body.message ??
      body.error ??
      body.response?.message ??
      `Request failed with status ${response.status}.`;

    throw new Error(
      `${String(message)} (HTTP ${response.status})`,
    );
  }

  return data as T;
}

// Load available universities/schools.
export async function getSchools(): Promise<School[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/school-config`,
    { credentials: "include" },
  );

  return handleResponse<School[]>(response);
}

// Load the payment plan.
export async function getPlan(): Promise<Plan> {
  const response = await fetch(
    `${API_BASE_URL}/api/plan`,
    { credentials: "include" },
  );

  return handleResponse<Plan>(response);
}

// STEP 1: Save the user's profile and receive a checkout token.
export async function createMyinderUser(
  profile: MyinderSubmission,
): Promise<CreateUserResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        school_id: profile.school_id,
        name: profile.name.trim(),
        ig_username: profile.ig_username.trim(),
        major: profile.major.trim(),
        bio: profile.bio ?? "",
        song: profile.song ?? "",
        photos: [],
      }),
    },
  );

  const user =
    await handleResponse<CreateUserResponse>(response);

  if (!user.checkout_token) {
    throw new Error(
      "The profile response did not include a checkout token.",
    );
  }

  return user;
}

// Retry only temporary server/gateway failures.
function isRetryableUploadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return /HTTP (502|503|504)/.test(error.message);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function uploadPhotoBatch(
  checkoutToken: string,
  batch: File[],
  batchNumber: number,
): Promise<string[]> {
  for (
    let attempt = 0;
    attempt <= MAX_UPLOAD_RETRIES;
    attempt++
  ) {
    const formData = new FormData();

    batch.forEach((photo) => {
      formData.append("photos", photo, photo.name);
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/photos`,
        {
          method: "POST",
          headers: {
            // The backend uses this token to identify the submission.
            Authorization: `Bearer ${checkoutToken}`,
          },
          // Let the browser set the multipart Content-Type boundary.
          body: formData,
        },
      );

      const result =
        await handleResponse<{ photos?: string[] }>(response);

      if (!Array.isArray(result.photos)) {
        throw new Error(
          `Photo batch ${batchNumber} returned an invalid response.`,
        );
      }

      return result.photos;
    } catch (error) {
      const canRetry =
        isRetryableUploadError(error) &&
        attempt < MAX_UPLOAD_RETRIES;

      if (!canRetry) {
        const detail =
          error instanceof Error
            ? error.message
            : "Unknown upload error.";

        throw new Error(
          `Photo batch ${batchNumber} failed: ${detail}`,
        );
      }

      // Retry after 1 second, then 2 seconds.
      await wait(1000 * (attempt + 1));
    }
  }

  throw new Error(`Photo batch ${batchNumber} failed.`);
}

// STEP 2: Upload watermarked photos in sequential batches.
export async function uploadMyinderPhotos(
  checkoutToken: string,
  photos: File[],
): Promise<{ photos: string[] }> {
  if (!checkoutToken.trim()) {
    throw new Error(
      "A valid checkout token is required to upload photos.",
    );
  }

  if (photos.length < 1 || photos.length > MAX_PHOTOS) {
    throw new Error(
      `Please select between 1 and ${MAX_PHOTOS} photos.`,
    );
  }

  for (const photo of photos) {
    if (!ALLOWED_TYPES.includes(photo.type)) {
      throw new Error(
        `${photo.name} is not supported. Use JPEG, PNG, or WebP.`,
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      throw new Error(
        `${photo.name} exceeds the 5 MB photo limit.`,
      );
    }
  }

  const uploadedPhotos: string[] = [];

  for (
    let i = 0;
    i < photos.length;
    i += BATCH_SIZE
  ) {
    const batch = photos.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    const batchPhotos = await uploadPhotoBatch(
      checkoutToken,
      batch,
      batchNumber,
    );

    uploadedPhotos.push(...batchPhotos);
  }

  return { photos: uploadedPhotos };
}

// STEP 3: Request a Stripe Checkout URL from the backend.
// The backend must validate the token and create the Stripe session.
// Never expose a Stripe secret key in frontend code.
export async function createCheckout(
  checkoutToken: string,
  planId: string,
  idempotencyKey: string,
): Promise<CheckoutResponse> {
  if (!checkoutToken.trim()) {
    throw new Error(
      "A valid checkout token is required to create checkout.",
    );
  }

  if (!planId.trim()) {
    throw new Error("Please select a payment plan.");
  }

  if (!idempotencyKey.trim()) {
    throw new Error(
      "A checkout idempotency key is required.",
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/payments/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${checkoutToken}`,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ planId }),
    },
  );

  // Only checkoutUrl is required by this frontend.
  const checkout =
    await handleResponse<CheckoutResponse>(response);

  if (
    typeof checkout.checkoutUrl !== "string" ||
    !checkout.checkoutUrl.trim()
  ) {
    throw new Error(
      "The backend did not return a Stripe checkout URL.",
    );
  }

  let checkoutUrl: URL;

  try {
    checkoutUrl = new URL(checkout.checkoutUrl);
  } catch {
    throw new Error("The checkout URL is invalid.");
  }

  // Permit HTTPS in production and HTTP only on localhost.
  const isLocalhost = [
    "localhost",
    "127.0.0.1",
    "::1",
  ].includes(checkoutUrl.hostname);

  if (
    checkoutUrl.protocol !== "https:" &&
    !(isLocalhost && checkoutUrl.protocol === "http:")
  ) {
    throw new Error(
      "The checkout URL must use HTTPS outside local development.",
    );
  }

  // Do not log checkout URLs or checkout tokens.
  return checkout;
}
