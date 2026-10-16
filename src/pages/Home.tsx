import { ArrowRight, Users } from "lucide-react";
import Header from "../components/layout/Header";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQs";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <Header />
      {/* Hero */}
     <HeroSection />
     <HowItWorks />
     <FAQ />

      {/* Footer */}
      <Footer />
    </main>
  );
}