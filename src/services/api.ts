
import type {
  MyinderProfile,
  University,
} from "../types/myinder";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "The request failed."
    );
  }

  return data as T;
}

// Load university names and colors from the backend.
export async function getUniversities(): Promise<University[]> {
  const response = await fetch(`${API_BASE_URL}/api/schools`, {
    credentials: "include",
  });

  return handleResponse<University[]>(response);
}

// Send profile details, original photos, and generated template to the backend.
export async function createMyinderSubmission(
  profile: MyinderProfile,
  photos: File[],
  template: Blob
): Promise<{ submissionId: string | number; checkoutUrl: string }> {
  const formData = new FormData();

  formData.append("profile", JSON.stringify(profile));

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  formData.append("template", template, "myinder-template.png");

  const response = await fetch(
    `${API_BASE_URL}/api/myinder/submissions`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  return handleResponse(response);
}
