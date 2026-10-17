
import { useState } from "react";
import {
  ChevronDown,
  MessageCircleQuestion,
  Users,
  LifeBuoy,
  ArrowUpRight,
} from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: Users,
    questions: [
      {
        question: "What is Mylnder?",
        answer:
          "Mylnder is a campus connection platform that helps students discover classmates, find roommates, join groups, and connect with their campus community in one place.",
      },
      {
        question: "How do I create a Mylnder account?",
        answer:
          "Sign up using your details, complete your profile, upload a clear photo, and follow the instructions to finish setting up your account.",
      },
      {
        question: "Who can join Mylnder?",
        answer:
          "Mylnder is designed for students who want to build meaningful connections around campus.",
      },
    ],
  },
  {
    category: "Connections & Features",
    icon: Users,
    questions: [
      {
        question: "How can I find classmates?",
        answer:
          "Explore profiles and discover students in your campus community who share your interests.",
      },
      {
        question: "Can I find a roommate on Mylnder?",
        answer:
          "Yes! Explore roommate listings and connect with students looking for compatible living arrangements.",
      },
      {
        question: "Can I create or join campus groups?",
        answer:
          "Explore the Groups and Events sections to discover campus activities and connect with students who share your interests.",
      },
    ],
  },
 
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>("0-0");

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-[#FFFCF8] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="faq-glow absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="faq-glow faq-glow-blue absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FF650F]">
            <MessageCircleQuestion size={16} />
            Got questions?
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#102746] sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="text-[#FF650F]">Questions</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Everything you need to know about finding your people,
            discovering your campus community, and getting started
            with Mylnder.
          </p>
        </div>

        {/* FAQ content */}
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-14">
          {/* Left information panel */}
          <div className="h-fit rounded-3xl border border-orange-100 bg-white/80 p-7 shadow-sm backdrop-blur-sm sm:p-9 lg:sticky lg:top-24">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF650F] text-white shadow-lg shadow-orange-200/60">
              <MessageCircleQuestion size={27} />
            </div>

            <h3 className="mt-6 text-2xl font-extrabold text-[#102746]">
              Still have questions?
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              We’re here to help you make the most of your campus
              experience. Reach out if you need a hand.
            </p>

            <a
              href="mailto:hello@myinder.com"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF650F] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E95708] hover:shadow-lg"
            >
              Contact Support
              <ArrowUpRight size={17} />
            </a>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {faqs.map((group, groupIndex) => {
              const GroupIcon = group.icon;

              return (
                <div key={group.category}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF650F]">
                      <GroupIcon size={20} />
                    </div>

                    <h3 className="text-base font-extrabold text-[#102746]">
                      {group.category}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {group.questions.map((faq, questionIndex) => {
                      const questionId = `${groupIndex}-${questionIndex}`;
                      const isOpen = openQuestion === questionId;

                      return (
                        <div
                          key={faq.question}
                          className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                            isOpen
                              ? "border-orange-200 shadow-md shadow-orange-100/50"
                              : "border-slate-200/80 shadow-sm hover:border-orange-200"
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${questionId}`}
                            onClick={() =>
                              setOpenQuestion(isOpen ? null : questionId)
                            }
                            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                          >
                            <span
                              className={`text-sm font-bold leading-6 sm:text-base ${
                                isOpen
                                  ? "text-[#FF650F]"
                                  : "text-[#102746]"
                              }`}
                            >
                              {faq.question}
                            </span>

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                isOpen
                                  ? "rotate-180 bg-[#FF650F] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <ChevronDown size={18} />
                            </span>
                          </button>

                          <div
                            id={`faq-answer-${questionId}`}
                            aria-hidden={!isOpen}
                            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                              isOpen
                                ? "grid-rows-[1fr]"
                                : "grid-rows-[0fr]"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl bg-[#102746] px-6 py-9 text-center shadow-xl shadow-slate-200/60 sm:px-10 sm:py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FF650F]">
            <LifeBuoy size={25} />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">
            Ready to find your people?
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
            Your next friendship, roommate, or campus connection
            could be just around the corner.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF650F] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E95708]"
          >
            Explore Mylnder
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
