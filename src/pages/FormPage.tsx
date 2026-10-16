
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";

import Header from "../components/layout/Header";
import ProfileDetailsStep from "../components/upload/ProfileDetailsStep";
import PhotoUploadStep from "../components/upload/PhotoUploadStep";
import { createMyinderSubmission } from "../services/api";
import { generateMyinderTemplate } from "../services/generateMyinderTemplate";
import { useMyinderFormStore } from "../stores/formstore";

const ORANGE = "#FF6900";
const steps = ["Your Details", "Upload Photos", "Payment"];

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { profile, photos, setProfileField } = useMyinderFormStore();

  function validateDetails() {
    if (!profile.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!profile.username.trim()) {
      setError("Please enter your Instagram username.");
      return false;
    }

    if (!profile.major.trim()) {
      setError("Please enter your major or course.");
      return false;
    }

    return true;
  }

  function continueFromDetails() {
    setError("");

    if (!validateDetails()) return;

    setStep(2);
  }

  function continueFromPhotos() {
    setError("");

    if (photos.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }

    setStep(3);
  }

  async function handlePayment() {
    setError("");

    if (!validateDetails()) {
      setStep(1);
      return;
    }

    if (photos.length === 0) {
      setError("Please upload at least one photo.");
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate the featured template silently in the browser.
      const template = await generateMyinderTemplate(
        photos[0],
        profile,
        ORANGE
      );

      // The backend should save the submission and create
      // the payment session. Never create Stripe sessions in the browser.
      const result = await createMyinderSubmission(
        profile,
        photos,
        template
      );

      if (!result?.checkoutUrl) {
        throw new Error(
          "The server did not return a payment checkout URL."
        );
      }

      // Permit HTTPS in production and HTTP only on localhost.
      const checkoutUrl = new URL(
        result.checkoutUrl,
        window.location.origin
      );

      const isLocalhost = [
        "localhost",
        "127.0.0.1",
        "::1",
      ].includes(checkoutUrl.hostname);

      if (
        checkoutUrl.protocol !== "https:" &&
        !(checkoutUrl.protocol === "http:" && isLocalhost)
      ) {
        throw new Error("The payment URL is invalid.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not submit your profile. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="bg-[#faf9f7] px-4 py-3 sm:px-8 sm:py-4 lg:min-h-[calc(100vh-72px)]">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/70">
          <div className="grid lg:min-h-[calc(100vh-104px)] lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left orange branding panel */}
            <aside className="relative flex min-h-[240px] flex-col overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
              <span className="text-2xl font-extrabold tracking-tight">
                myinder
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
                      ? "Show off your best moments and let your personality shine through."
                      : "Your profile is ready. Continue to secure checkout to complete your submission."}
                </p>
              </div>

              <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-orange-400/70" />
              <div className="pointer-events-none absolute -bottom-32 right-[-50px] h-80 w-80 rounded-full bg-orange-300/40" />

              <div className="relative z-10 mt-auto hidden pt-8 lg:block">
                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="font-bold">Your story starts here.</p>
                  <p className="mt-2 text-sm leading-6 text-orange-50">
                    Create your profile, choose your best photos, and
                    share your campus identity with Myinder.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right form panel */}
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
                      : "Check your submission summary before continuing to secure payment."}
                </p>
              </div>

              {/* Three-step progress */}
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

              {/* Step 1: Details */}
              {step === 1 && (
                <ProfileDetailsStep
                  profile={profile}
                  universities={[]}
                  onChange={setProfileField}
                />
              )}

              {/* Step 2: Photo upload; component supports up to 10 */}
              {step === 2 && <PhotoUploadStep />}

              {/* Step 3: Payment summary */}
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
                          @{profile.username.replace(/^@/, "")}
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
                          {profile.school || "Not provided"}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Photos uploaded</dt>
                        <dd className="font-semibold text-slate-900">
                          {photos.length} / 10
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {photos.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <ImagePlus className="text-orange-600" size={20} />
                        <h3 className="font-bold text-slate-900">
                          Your photos
                        </h3>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {photos.map((photo, index) => (
                          <PaymentPhoto
                            key={`${photo.name}-${index}`}
                            photo={photo}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-orange-50 p-4 text-sm leading-6 text-orange-900">
                    Your featured template will be generated automatically
                    when you proceed. Your submission must remain pending
                    until the backend verifies successful payment.
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

              {/* Navigation */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setError("");
                      setStep((current) => current - 1);
                    }}
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
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 sm:px-6"
                  >
                    Continue to photos
                    <ArrowRight size={17} />
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    onClick={continueFromPhotos}
                    disabled={photos.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                  >
                    Continue to payment
                    <ArrowRight size={17} />
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
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

function PaymentPhoto({
  photo,
  index,
}: {
  photo: File;
  index: number;
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  // Keep object URLs tied to the component lifecycle to avoid leaks.
  useState(() => {
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  });

  return (
    <div className="relative min-w-0">
      {previewUrl && (
        <img
          src={previewUrl}
          alt={`Uploaded photo ${index + 1}`}
          className="aspect-square w-full rounded-lg border border-slate-200 object-cover"
        />
      )}

      {index === 0 && (
        <span className="absolute bottom-1 left-1 rounded bg-orange-600 px-1 py-0.5 text-[9px] font-semibold text-white">
          Featured
        </span>
      )}
    </div>
  );
}
