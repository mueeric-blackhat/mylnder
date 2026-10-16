
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Home,
  MessageCircle,
  Play,
  Plus,
  Search,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { useState } from "react";

{}

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Friends");

  const categories = [
    { name: "Friends", icon: Users },
    { name: "Roommates", icon: Home },
    { name: "Events", icon: CalendarDays },
    { name: "Groups", icon: Settings },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#10141D]">
     
      {/* HERO */}
      <section
        id="home"
        className="relative isolate mx-auto max-w-[1200px] px-6 pb-14 pt-8 lg:min-h-[510px] lg:px-12 lg:pb-8"
      >
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute right-[-90px] top-[-100px] -z-10 h-[390px] w-[390px] rounded-full bg-[#FFE4CC] blur-[1px]" />
        <div className="pointer-events-none absolute bottom-[-100px] right-[15%] -z-10 h-[330px] w-[330px] rounded-full bg-[#FFF0E4]" />
        <div className="pointer-events-none absolute right-[4%] top-[100px] -z-10 h-[310px] w-[280px] rounded-[45%] bg-gradient-to-br from-[#FFF9F3] to-[#FFDCC0]" />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-4">
          {/* LEFT: Editable hero text */}
          <div className="relative z-10 max-w-[510px]">
            <span className="inline-flex rounded-full bg-[#FFF0E5] px-4 py-2 text-xs font-semibold text-[#F35D13]">
              Your Campus. Your People.
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[48px]">
              Find Friends,
              <br />
              Roommates &
              <br />
              <span className="text-[#FF650F]">
                Build Your Campus Life
              </span>
            </h1>

            <p className="mt-5 max-w-[390px] text-[15px] leading-6 text-[#607084]">
              Connect with fellow students, find roommates, discover local
              events and make the most of your college experience — all in
              one place.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                id="get-started"
                href="#explore"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF650F] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:bg-[#ed5705]"
              >
                Get Started Today <ArrowRight size={17} />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-[#FF650F] bg-white px-6 py-3.5 text-sm font-bold text-[#FF650F] transition hover:bg-[#FFF4EC]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF650F] text-white">
                  <Play size={11} fill="currentColor" />
                </span>
                How It Works
              </a>
            </div>

            {/* Community proof */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-3">
                 {/*  {[campusFriends, campusCommunity, campusFriends, campusCommunity].map(
                (photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Myinder student ${index + 1}`}
                    className="h-9 w-9 rounded-full border-[3px] border-white object-cover"
                  />
                )
              )} */}
             
              </div>
              <div>
                <p className="text-xs font-bold text-[#253247]">
                  Join 100,000+ students
                </p>
                <p className="mt-1 text-[11px] text-[#718096]">
                  making new connections on Myinder
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Editable phone and photo composition */}
          <div className="relative mx-auto h-[510px] w-full max-w-[570px]">
            {/* Decorative glow */}
            <div className="absolute left-[20%] top-[15%] h-[320px] w-[320px] rounded-full bg-[#FFE4D1]/70 blur-3xl" />

            {/* Floating photo 1 */}
            <div className="absolute right-[1%] top-[7%] z-10 w-[45%] rotate-[-6deg] rounded-xl border-[5px] border-white bg-white p-1 shadow-xl transition duration-300 hover:rotate-0">
              {/* <img
                src={campusFriends}
                alt="University friends meeting on campus"
                className="h-[130px] w-full rounded-md object-cover sm:h-[145px]"
              /> */}
              <div className="px-2 py-2">
                <p className="font-serif text-[15px] font-bold italic leading-tight">
                  Real People.
                  <br />
                  Real Connections.
                </p>
                <div className="ml-auto mt-1 h-1 w-12 rotate-[-10deg] rounded-full bg-[#FF650F]" />
              </div>
            </div>

            {/* Floating photo 2 */}
            <div className="absolute bottom-[9%] right-[5%] z-10 w-[46%] rotate-[5deg] rounded-xl border-[5px] border-white bg-white p-1 shadow-xl transition duration-300 hover:rotate-0">
              {/* <img
                src={campusCommunity}
                alt="Students socializing together"
                className="h-[130px] w-full rounded-md object-cover sm:h-[145px]"
              /> */}
            </div>

            {/* Phone frame */}
            <div className="absolute left-[7%] top-[2%] z-20 h-[470px] w-[235px] rounded-[38px] border-[5px] border-[#202124] bg-[#171717] p-[5px] shadow-2xl sm:left-[12%] sm:w-[245px]">
              {/* Phone screen */}
              <div className="relative h-full overflow-hidden rounded-[30px] bg-white">
                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-30 h-[20px] w-[100px] -translate-x-1/2 rounded-b-2xl bg-black" />

                {/* Status bar */}
                <div className="flex h-7 items-center justify-between px-4 pt-1 text-[8px] font-bold">
                  <span>9:41</span>
                  <span>● ▰ ▰</span>
                </div>

                {/* App branding */}
                <div className="flex items-center gap-1 px-3 py-2">
                  <Users size={19} className="text-[#FF650F]" strokeWidth={3} />
                  <span className="text-[14px] font-extrabold">myinder</span>
                </div>

                {/* Search */}
                <div className="mx-3 flex items-center gap-2 rounded-full border border-slate-100 bg-[#F8FAFC] px-3 py-2">
                  <Search size={12} className="text-slate-400" />
                  <span className="truncate text-[9px] text-slate-400">
                    Search friends, roommates, events...
                  </span>
                </div>

                {/* Editable categories */}
                <div className="grid grid-cols-4 gap-1 px-2 pt-4">
                  {categories.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveCategory(name)}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                          activeCategory === name
                            ? "bg-[#FFE9DA] text-[#FF650F]"
                            : "bg-[#FFF5EF] text-[#F58245]"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="text-[8px] font-semibold text-slate-600">
                        {name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Featured section */}
                <div className="mt-4 flex items-center justify-between px-3">
                  <h3 className="text-[11px] font-extrabold">
                    Featured {activeCategory}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveCategory("Friends")}
                    className="text-[9px] font-bold text-[#FF650F]"
                  >
                    See all
                  </button>
                </div>

                {/* Editable feature card */}
                <div className="mx-3 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                {/* <img
                    src={campusFriends}
                    alt="Students looking to connect"
                    className="h-[112px] w-full object-cover"
                  /> */}
                  
                 
                  <div className="p-2">
                    <p className="text-[10px] font-bold">
                      Looking for a roommate?
                    </p>
                    <p className="mt-1 text-[8px] text-slate-500">
                      3 Bed · Shared Apartment · Nairobi
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[8px] text-[#FF650F]">
                      <Home size={10} /> Roommate
                    </div>
                  </div>
                </div>

                <div className="mx-3 mt-2 rounded-lg bg-[#FFF4EC] px-2 py-2">
                  <p className="text-[9px] font-bold text-[#45372F]">
                    Find your people, wherever campus takes you.
                  </p>
                </div>

                {/* Phone bottom navigation */}
                <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 bg-white px-2 pb-2 pt-2">
                  <div className="flex items-center justify-between">
                    {[
                      { name: "Home", icon: Home },
                      { name: "Chat", icon: MessageCircle },
                      { name: "Add", icon: Plus },
                      { name: "Alerts", icon: Bell },
                      { name: "Profile", icon: UserRound },
                    ].map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setActiveTab(name)}
                        aria-label={name}
                        className={`flex flex-col items-center gap-1 ${
                          activeTab === name
                            ? "text-[#FF650F]"
                            : "text-slate-400"
                        }`}
                      >
                        <span
                          className={
                            name === "Add"
                              ? "flex h-7 w-7 items-center justify-center rounded-full bg-[#FF650F] text-white"
                              : ""
                          }
                        >
                          <Icon size={name === "Add" ? 17 : 14} />
                        </span>
                        <span className="text-[7px]">{name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-black" />
                </div>
              </div>
            </div>

            {/* Small orange decorative strokes */}
            <div className="absolute bottom-[14%] right-[0%] rotate-[-25deg] text-4xl font-light text-[#FF650F]">
              〰
            </div>
            <div className="absolute right-[0%] top-[35%] rotate-[-25deg] text-2xl text-[#FF650F]">
              〽
            </div>
          </div>
        </div>
      </section>

      {/* Next section preview */}
      <section
        id="explore"
        className="border-t border-[#F7F2EE] bg-[#FFFCF9] px-6 py-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Explore by Category
          </h2>
          <p className="mt-2 text-sm text-[#718096]">
            Find exactly what you need, whether it’s a friend, a roommate, or
            your next event.
          </p>
        </div>
      </section>
    </main>
  );
}
