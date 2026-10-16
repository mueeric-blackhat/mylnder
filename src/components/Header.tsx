import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold tracking-tight text-slate-900"
        >
          <span className="rounded-xl bg-blue-600 p-2 text-white">
            <Code2 size={20} />
          </span>
          <span className="text-lg">
            My<span className="text-blue-600">Project</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
        </nav>

        <div className="hidden md:block">
          <a
            href="#get-started"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get started
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <NavLink to="/" end className={navClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>
            <a
              href="#get-started"
              onClick={closeMenu}
              className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
            >
              Get started
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}