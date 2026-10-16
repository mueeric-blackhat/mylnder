import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Error 404</p>
      <h1 className="mt-4 text-5xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-4 max-w-md leading-7 text-slate-600">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
        <ArrowLeft size={18} /> Return home
      </Link>
    </main>
  );
}