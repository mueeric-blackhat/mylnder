import { useState } from "react";
import { Code2, Users, Menu, X } from "lucide-react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    
      <header className="relative z-20 mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-12">
        <a href="#" className="flex items-center gap-2">
          <span className="relative flex items-center text-[#FF650F]">
            <Users size={30} strokeWidth={3} />
          </span>
          <span className="text-[23px] font-extrabold tracking-tight">
            myinder
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {["Home", "About", "How It Works", "Pricing", "FAQ"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className={`border-b-2 pb-2 text-[13px] font-semibold transition ${
                  item === "Home"
                    ? "border-[#FF650F] text-[#10141D]"
                    : "border-transparent text-slate-600 hover:border-[#FF650F] hover:text-[#FF650F]"
                }`}
              >
                {item}
              </a>
            )
          )}
        </nav>

        <a
          href="#get-started"
          className="rounded-full bg-[#FF650F] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ed5705]"
        >
          Get Started
        </a>
      </header>

  );
}