
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import ProfileDetailsStep from "../components/upload/ProfileDetailsStep";
import PhotoUploadStep from "../components/upload/PhotoUploadStep";
import {
  createMyinderUser,
  createCheckout,
  getPlan,
  getSchools,
  uploadMyinderPhotos,
} from "../services/api";
import {
  generateMyinderTemplate,
  watermarkPhoto,
} from "../services/generateMyinderTemplate";
import { useMyinderFormStore } from "../stores/formstore";
import type {
  MyinderSubmission,
  School,
} from "../types/myinder";

const steps = ["Your Details", "Upload Photos", "Payment"];
const MAX_PHOTOS = 10;
const BRAND_ORANGE = "#F97316";

// This key must match PaymentSuccessPage.tsx exactly.
// sessionStorage persists in the same tab during the Stripe redirect.
const CHECKOUT_TOKEN_KEY = "mylnder_checkout_token";

type PaymentPlan = {
  id: string;
  name: string;
  amount: string | number;
  currency: string;
  is_active: boolean;
  is_current?: boolean;
};

function parsePlans(response: unknown): PaymentPlan[] {
  if (Array.isArray(response)) {
    return response as PaymentPlan[];
  }

  if (response && typeof response === "object") {
    const value = response as Record<string, unknown>;

    if (Array.isArray(value.plans)) {
      return value.plans as PaymentPlan[];
    }

    if (typeof value.id === "string") {
      return [value as unknown as PaymentPlan];
    }

    if (value.data && typeof value.data === "object") {
      return parsePlans(value.data);
    }
  }

  return [];
}

// Detect photo replacements even when the photo count is unchanged.
function getPhotoSignature(photos: File[]): string {
  return JSON.stringify(
    photos.map((photo) => ({
      name: photo.name,
      size: photo.size,
      type: photo.type,
      lastModified: photo.lastModified,
    }))
  );
}

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the token in memory during the form flow.
  // sessionStorage preserves it during the same-tab Stripe redirect.
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);

  const [uploadedPhotoSignature, setUploadedPhotoSignature] =
    useState<string | null>(null);

  const { profile, photos, setProfileField } = useMyinderFormStore();

  const {
    data: schools = [],
    isLoading: schoolsLoading,
    error: schoolsError,
    refetch: refetchSchools,
  } = useQuery<School[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: planResponse,
    error: plansError,
    isLoading: plansLoading,
    refetch: refetchPlan,
  } = useQuery<unknown>({
    queryKey: ["plan"],
    queryFn: getPlan,
    staleTime: 5 * 60 * 1000,
    enabled: step === 3,
  });

  const plans = parsePlans(planResponse);

  const selectedPlan =
    plans.find((plan) => plan.is_current && plan.is_active) ??
    plans.find((plan) => plan.is_active);

  const amount = selectedPlan ? Number(selectedPlan.amount) : NaN;

  const formattedPrice =
    selectedPlan &&
    Number.isFinite(amount) &&
    amount >= 0 &&
    selectedPlan.currency
      ? (() => {
          try {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: selectedPlan.currency.toUpperCase(),
            }).format(amount);
          } catch {
            return null;
          }
        })()
      : null;

  const selectedSchool = schools.find(
    (school) => school.id === profile.school_id
  );

  const currentPhotoSignature = getPhotoSignature(photos);

  const photosAreUploaded =
    photos.length > 0 &&
    uploadedPhotoSignature === currentPhotoSignature;

  function validateDetails(): boolean {
    if (!profile.school_id.trim()) {
      setError("Please select your university.");
      return false;
    }

    if (!profile.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!profile.ig_username.trim()) {
      setError("Please enter your Instagram username.");
      return false;
    }

    if (!profile.major.trim()) {
      setError("Please enter your major or course.");
      return false;
    }

    return true;
  }

  // STEP 1: Save profile details and preserve the checkout token.
  async function continueFromDetails() {
    setError("");

    if (schoolsError) {
      const result = await refetchSchools();

      if (result.error) {
        setError(
          "We could not load the university list. Please try again."
        );
        return;
      }
    }

    if (schoolsLoading) {
      setError("Please wait while the university list loads.");
      return;
    }

    if (!validateDetails()) return;

    setIsSubmitting(true);

    try {
      const user = await createMyinderUser(profile);

      if (!user.checkout_token) {
        throw new Error("The server did not return a checkout token.");
      }

      // Save before proceeding. If storage fails, do not continue
      // with a checkout flow that the success page cannot recover.
      try {
        sessionStorage.setItem(
          CHECKOUT_TOKEN_KEY,
          user.checkout_token
        );
      } catch {
        throw new Error(
          "Your browser could not save the checkout session. Please enable session storage and try again."
        );
      }

      setCheckoutToken(user.checkout_token);
      setUploadedPhotoSignature(null);
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not save your details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // STEP 2: Generate the profile template and upload the photos.
  async function continueFromPhotos() {
    setError("");

    if (!checkoutToken) {
      setError(
        "Your checkout token is missing. Please submit your details again."
      );
      setStep(1);
      return;
    }

    if (photos.length < 1 || photos.length > MAX_PHOTOS) {
      setError(`Please upload between 1 and ${MAX_PHOTOS} photos.`);
      return;
    }

    if (!selectedSchool) {
      setError(
        "We could not find your selected university. Please return to your details and select it again."
      );
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!photosAreUploaded) {
        const themeColor =
          selectedSchool.custom_color || BRAND_ORANGE;

        const templateBlob = await generateMyinderTemplate(
          photos[0],
          profile as MyinderSubmission,
          selectedSchool,
        
        );

        const firstPhotoBaseName =
          photos[0].name.replace(/\.[^.]+$/, "") || "myinder-profile";

        const templateFile = new File(
          [templateBlob],
          `${firstPhotoBaseName}-myinder-template.png`,
          {
            type: "image/png",
            lastModified: Date.now(),
          }
        );

        const remainingWatermarkedPhotos = await Promise.all(
          photos.slice(1).map((photo) =>
            watermarkPhoto(photo, themeColor)
          )
        );

        const filesToUpload = [
          templateFile,
          ...remainingWatermarkedPhotos,
        ];

        if (filesToUpload.length !== photos.length) {
          throw new Error(
            "Not all photos could be prepared. Please try again."
          );
        }

        const result = await uploadMyinderPhotos(
          checkoutToken,
          filesToUpload
        );

        if (
          !Array.isArray(result.photos) ||
          result.photos.length !== filesToUpload.length
        ) {
          throw new Error(
            "The server did not confirm that all photos were uploaded."
          );
        }

        setUploadedPhotoSignature(currentPhotoSignature);
      }

      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Photos could not be prepared or uploaded. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // STEP 3: Create Stripe Checkout and redirect.
  async function handlePayment() {
    if (isSubmitting) return;

    setError("");

    if (!checkoutToken) {
      setError(
        "Your checkout token is missing. Please submit your details again."
      );
      setStep(1);
      return;
    }

    if (!photosAreUploaded) {
      setError(
        "Please upload your current photos before proceeding to payment."
      );
      setStep(2);
      return;
    }

    if (plansLoading) {
      setError("Please wait while the payment plan loads.");
      return;
    }

    if (plansError || !selectedPlan || !formattedPrice) {
      setError(
        "We could not load an active payment plan. Please try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Save again immediately before starting checkout.
      // Never put the bearer token in the Stripe URL.
      try {
        sessionStorage.setItem(
          CHECKOUT_TOKEN_KEY,
          checkoutToken
        );

        const savedToken = sessionStorage.getItem(
          CHECKOUT_TOKEN_KEY
        );

        if (savedToken !== checkoutToken) {
          throw new Error("The checkout token could not be preserved.");
        }
      } catch {
        throw new Error(
          "Your browser could not preserve the checkout session. Please enable session storage and try again."
        );
      }

      const idempotencyKey = crypto.randomUUID();

      const result = await createCheckout(
        checkoutToken,
        selectedPlan.id,
        idempotencyKey
      );

      if (
        typeof result.checkoutUrl !== "string" ||
        !result.checkoutUrl.trim()
      ) {
        throw new Error("The server did not return a payment URL.");
      }

      let checkoutUrl: URL;

      try {
        checkoutUrl = new URL(result.checkoutUrl);
      } catch {
        throw new Error("The payment URL is invalid.");
      }

      const isLocalhost = [
        "localhost",
        "127.0.0.1",
        "::1",
        "[::1]",
      ].includes(checkoutUrl.hostname);

      if (
        checkoutUrl.protocol !== "https:" &&
        !(checkoutUrl.protocol === "http:" && isLocalhost)
      ) {
        throw new Error("The payment URL is invalid.");
      }

      // Stripe handles the hosted payment form.
      // The backend must verify payment before granting paid access.
      window.location.assign(checkoutUrl.toString());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not prepare your payment. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  function goBack() {
    if (isSubmitting) return;

    setError("");

    if (step === 3) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(1);
    }
  }

  return (
    <>
      <Header />

      <main className="bg-[#faf9f7] px-4 py-3 sm:px-8 sm:py-4 lg:min-h-[calc(100vh-72px)]">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/70">
          <div className="grid lg:min-h-[calc(100vh-104px)] lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="relative flex min-h-[240px] flex-col overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
              <span className="text-2xl font-extrabold tracking-tight">
                mylnder
              </span>

              <div className="relative z-10 mt-6 sm:mt-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-100">
                  Your campus. Your story.
                </p>

                <h1 className="max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">
                  {step === 1
                    ? "Create your campus story."
                    : step === 2
                      ? "Upload your photos."
                      : "Complete your payment."}
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-orange-50 sm:text-base">
                  {step === 1
                    ? "Make your profile, share your moments, and connect with your campus community."
                    : step === 2
                      ? "Your first photo gets the complete Mylnder profile design."
                      : "Review your submission and continue to secure checkout."}
                </p>
              </div>

              <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-orange-400/70" />
              <div className="pointer-events-none absolute -bottom-32 right-[-50px] h-80 w-80 rounded-full bg-orange-300/40" />

              <div className="relative z-10 mt-auto hidden pt-8 lg:block">
                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="font-bold">Your story starts here.</p>
                  <p className="mt-2 text-sm leading-6 text-orange-50">
                    Create your profile, choose your photos, and share
                    your campus identity with Mylnder.
                  </p>
                </div>
              </div>
            </aside>

            <section className="min-w-0 p-4 sm:p-6 lg:p-8">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {step === 1
                    ? "Create your profile"
                    : step === 2
                      ? "Upload your photos"
                      : "Payment"}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {step === 1
                    ? "Share your personality with your campus community."
                    : step === 2
                      ? "Add up to 10 photos. Your first photo will be your featured post."
                      : "Review your submission before continuing to secure payment."}
                </p>
              </div>

              <div className="mb-6 flex items-start">
                {steps.map((label, index) => {
                  const number = index + 1;
                  const complete = step > number;
                  const active = step === number;

                  return (
                    <div
                      key={label}
                      className="flex min-w-0 flex-1 items-start"
                    >
                      <div className="flex min-w-0 flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                            complete || active
                              ? "bg-teal-600 text-white"
                              : "border-2 border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          {complete ? <Check size={18} /> : number}
                        </div>

                        <span
                          className={`mt-2 text-center text-xs font-semibold sm:text-sm ${
                            active ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {label}
                        </span>
                      </div>

                      {number < 3 && (
                        <div
                          className={`mx-2 mt-3.5 h-0.5 flex-1 sm:mx-4 ${
                            complete ? "bg-teal-600" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {step === 1 && (
                <>
                  {schoolsLoading && (
                    <p className="mb-3 text-sm text-slate-500">
                      Loading universities...
                    </p>
                  )}

                  {schoolsError && (
                    <div className="mb-3 text-sm text-red-600">
                      <p role="alert">
                        We could not load the university list.
                      </p>
                      <button
                        type="button"
                        onClick={() => void refetchSchools()}
                        className="mt-2 font-semibold underline"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  <ProfileDetailsStep
                    profile={profile}
                    schools={schools}
                    onChange={setProfileField}
                  />
                </>
              )}

              {step === 2 && <PhotoUploadStep />}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-900">
                      Submission summary
                    </h3>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Full name</dt>
                        <dd className="text-right font-semibold text-slate-900">
                          {profile.name}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Instagram</dt>
                        <dd className="break-all text-right font-semibold text-slate-900">
                          @{profile.ig_username.replace(/^@/, "")}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Major / course</dt>
                        <dd className="text-right font-semibold text-slate-900">
                          {profile.major}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">University</dt>
                        <dd className="text-right font-semibold text-slate-900">
                          {selectedSchool?.name ?? "Not provided"}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Selected photos</dt>
                        <dd className="font-semibold text-slate-900">
                          {photos.length} / {MAX_PHOTOS}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Profile template</dt>
                        <dd className="text-right font-semibold text-slate-900">
                          {photosAreUploaded
                            ? "Prepared and uploaded"
                            : "Will be generated before upload"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <h3 className="font-bold text-slate-900">
                      Payment plan
                    </h3>

                    {plansLoading ? (
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                        Loading current price...
                      </div>
                    ) : plansError ? (
                      <div className="mt-2">
                        <p className="text-sm text-red-600">
                          Unable to load the payment plan.
                        </p>
                        <button
                          type="button"
                          onClick={() => void refetchPlan()}
                          className="mt-2 text-sm font-semibold text-orange-700 underline"
                        >
                          Try again
                        </button>
                      </div>
                    ) : selectedPlan && formattedPrice ? (
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-600">
                          {selectedPlan.name}
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                          {formattedPrice}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-red-600">
                          No active payment plan is available.
                        </p>
                        <button
                          type="button"
                          onClick={() => void refetchPlan()}
                          className="mt-2 text-sm font-semibold text-orange-700 underline"
                        >
                          Reload payment plan
                        </button>
                      </div>
                    )}

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Payment is processed securely on Stripe.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:px-5"
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>
                ) : (
                  <a
                    href="/"
                    className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 sm:px-5"
                  >
                    Cancel
                  </a>
                )}

                {step === 1 && (
                  <button
                    type="button"
                    onClick={continueFromDetails}
                    disabled={schoolsLoading || isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Saving details...
                      </>
                    ) : (
                      <>
                        Continue to photos
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    onClick={continueFromPhotos}
                    disabled={
                      isSubmitting ||
                      photos.length === 0 ||
                      photos.length > MAX_PHOTOS ||
                      !checkoutToken
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Continue to payment
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={
                      isSubmitting ||
                      plansLoading ||
                      !checkoutToken ||
                      !photosAreUploaded ||
                      !selectedPlan ||
                      !formattedPrice
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Preparing payment...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
