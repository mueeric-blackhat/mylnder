
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-14 w-14 text-green-600" />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
          Mylnder
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-4 leading-7 text-gray-600">
          Thank you for your payment. <br></br>
          Welcome to Mylnder Again!
        </p>

        <div className="mt-6 rounded-2xl bg-green-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-green-600" />
            <p className="text-sm leading-6 text-gray-600">
            your payment was completed successfully. 
            You will be posted within 48 hours.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
        >
          Go Home
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </main>
  );
}
