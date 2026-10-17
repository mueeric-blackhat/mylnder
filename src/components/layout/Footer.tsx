
import {
  ArrowUpRight,
 
  Link,
 
  Mail,
} from "lucide-react";
import logo from "../../assets/logo.png";



const footerLinks = {
  Explore: [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "#how-it-works" },
   
  ],
  Support: [
    { label: "Contact Us", href: "mailto:hello@myinder.com" },
    { label: "Help Center", href: "#help" },
    
  ],
};

export default function Footer() {
  return (
    <footer className="myinder-footer relative isolate overflow-hidden border-t border-slate-200">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Warm ivory base */}
        <div className="absolute inset-0 bg-[#FFFCF8]" />

        {/* Animated orange glow */}
        <div className="footer-glow footer-glow-orange absolute -bottom-40 -left-24 h-80 w-[65%] rounded-[50%] bg-orange-200/50 blur-3xl" />

        {/* Animated blue glow */}
        <div className="footer-glow footer-glow-blue absolute -bottom-36 -right-24 h-72 w-[55%] rounded-[50%] bg-blue-100/70 blur-3xl" />

        {/* Floating decorative circles */}
        <div className="footer-float absolute left-[10%] top-12 h-3 w-3 rounded-full bg-orange-300/70" />

        <div className="footer-float footer-float-delayed absolute right-[12%] top-20 h-4 w-4 rounded-full bg-blue-200/80" />

        <div className="footer-float footer-float-slow absolute bottom-20 left-[45%] h-2.5 w-2.5 rounded-full bg-orange-300/70" />

        <div className="footer-float footer-float-delayed absolute right-[35%] top-[45%] h-2 w-2 rounded-full bg-orange-200/80" />

        {/* Decorative corner shapes */}
        <div className="footer-orbit absolute -left-16 -top-24 h-56 w-56 rounded-full border border-orange-200/80" />

        <div className="absolute -right-12 -top-12 h-32 w-32 rotate-45 rounded-[30px] bg-blue-100/30" />

        {/* Animated wave lines */}
        <svg
          className="absolute inset-x-0 bottom-0 h-44 w-full opacity-70"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            className="footer-wave footer-wave-one"
            d="M-50 95 C180 5 310 175 550 100 S920 20 1120 95 S1360 145 1490 40"
            stroke="#FDBA74"
            strokeWidth="1.5"
          />

          <path
            className="footer-wave footer-wave-two"
            d="M-50 125 C180 45 330 190 580 120 S900 40 1130 105 S1360 120 1490 65"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Footer content */}
      <div className="mx-auto max-w-[1600px] px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="Myinder home"
            >
                <img
            src={logo}
            alt="Myinder"
            className="h-12 w-auto max-w-[270px] object-contain"
          />
              

             
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              Your campus, your people, your connections. Discover your
              community and make meaningful connections with classmates.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
             
            </div>
          </div>

          {/* Explore and Support columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-bold text-[#102746]">
                {heading}
              </h3>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-600 transition-colors duration-200 hover:text-[#FF650F]"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-slate-200/70 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Mylnder. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made for campus connections
           
          </p>
        </div>
      </div>
    </footer>
  );
}
