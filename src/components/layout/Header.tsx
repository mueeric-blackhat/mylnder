
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "../../assets/Logo.png";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    setMenuOpen(false);

    const sectionId = href.substring(1);
    const destination =
      sectionId === "home" ? "/home" : `/home#${sectionId}`;

    if (location.pathname !== "/home") {
      navigate(destination, { state: { scrollTo: sectionId } });
      return;
    }

    navigate(destination, { replace: true, state: null });

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavigation("#home")}
          aria-label="Mylnder home"
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Mylnder"
            className="h-10 w-auto max-w-[270px] object-contain"
          />
        </button>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                handleNavigation(item.href);
              }}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#FF650F]"
            >
              {item.name}
            </a>
          ))}

          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF650F] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:bg-[#ed5705]"
          >
            Get Posted Today <ArrowRight size={17} />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-[#102746] transition hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-xl md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigation(item.href);
                }}
                className="rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-orange-50 hover:text-[#FF650F]"
              >
                {item.name}
              </a>
            ))}

            <Link
              to="/create"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF650F] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#ed5705]"
            >
              Get Posted Today <ArrowRight size={17} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}