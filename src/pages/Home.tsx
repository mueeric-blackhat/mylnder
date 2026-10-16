import { ArrowRight, Users } from "lucide-react";
import Header from "../components/layout/Header";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <Header />
      {/* Hero */}
     <HeroSection />

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Myinder. Built for campus life.
      </footer>
    </main>
  );
}