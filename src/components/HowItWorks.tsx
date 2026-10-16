
import { motion, useReducedMotion } from "framer-motion";
import {
  UserRound,
  Plus,
  CreditCard,
  LockKeyhole,
  Check,
  PartyPopper,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

const steps = [
  {
    number: "STEP 1",
    title: "Enter your details",
    description: "Fill in your details to get started with your post.",
    type: "profile",
  },
  {
    number: "STEP 2",
    title: "Upload image & make payment",
    description: "Upload your image and complete your secure payment.",
    type: "payment",
  },
  {
    number: "STEP 3",
    title: "Details submitted",
    description:
      "Live in 3 days or same day. Classmates start finding and reaching out to you.",
    type: "success",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 55,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function ProfileIllustration() {
  return (
    <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute h-48 w-48 rounded-full bg-orange-100/70"
      />

      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-10 w-40 rounded-2xl border border-white bg-white/90 p-4 shadow-xl shadow-slate-200/70"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <UserRound className="h-11 w-11 text-blue-400" />
        </div>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-slate-200" />
          <div className="h-2 rounded-full bg-slate-200" />
          <div className="h-2 w-2/3 rounded-full bg-slate-200" />
        </div>

        <motion.div
          whileHover={{ scale: 1.15, rotate: 90 }}
          className="absolute -right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
        >
          <Plus size={24} />
        </motion.div>
      </motion.div>

      <motion.span
        animate={{ x: [-4, 4, -4], y: [3, -3, 3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-[23%] top-[28%] h-3 w-3 rotate-45 rounded-sm bg-orange-400"
      />

      <motion.span
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute right-[18%] top-[25%] h-3 w-3 rounded-full bg-blue-200"
      />
    </div>
  );
}

function PaymentIllustration() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 p-4">
      <motion.div
        whileHover={{ y: -4 }}
        className="w-full max-w-xs rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tight text-indigo-600">
            stripe
          </span>

          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <LockKeyhole size={12} />
            Secure payment
          </span>
        </div>

        <label className="mb-1.5 block text-xs text-slate-500">
          Card number
        </label>

        <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-xs text-slate-400">
          <CreditCard size={17} className="text-slate-700" />
          1234 5678 9012 3456
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-slate-500">
              Expiry date
            </label>

            <div className="rounded-lg border border-slate-200 p-2.5 text-xs text-slate-400">
              MM / YY
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-500">
              CVC
            </label>

            <div className="rounded-lg border border-slate-200 p-2.5 text-xs text-slate-400">
              123
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 p-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200">
          <LockKeyhole size={15} />
          Pay $12.00
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-400">
          Powered by{" "}
          <span className="font-bold text-slate-700">stripe</span>
        </p>
      </motion.div>
    </div>
  );
}

function SuccessIllustration() {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 px-4 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
        className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-200">
          <Check size={38} strokeWidth={4} className="text-white" />
        </div>
      </motion.div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-orange-400 shadow-lg">
          <PartyPopper size={25} />
        </div>

        <h3 className="text-left text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          Your Post Is Live
        </h3>
      </div>

      <p className="max-w-xs text-sm leading-6 text-slate-500 sm:text-base">
        Live in 3 days or same day. Classmates start finding and reaching out
        to you.
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  const illustrations = [
    <ProfileIllustration key="profile" />,
    <PaymentIllustration key="payment" />,
    <SuccessIllustration key="success" />,
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-24 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-50/60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-1.5 text-xs font-bold tracking-[0.16em] text-orange-600 sm:text-sm">
            <ShieldCheck size={15} />
            SIMPLE &amp; SECURE
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#102746] sm:text-4xl lg:text-5xl">
            How does it work?
          </h2>
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              variants={shouldReduceMotion ? undefined : cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/50 sm:p-4"
            >
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                {illustrations[index]}
              </div>

              <div className="px-2 pb-5 pt-5 text-center sm:pb-7">
                <span className="inline-flex rounded-full bg-orange-50 px-4 py-1.5 text-xs font-extrabold tracking-wider text-orange-600">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-extrabold tracking-tight text-[#102746] sm:text-xl">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 hidden max-w-sm text-xs leading-5 text-slate-500 md:block">
                  {step.description}
                </p>

                <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-slate-500 md:hidden">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"
        >
        
        </motion.div>
      </div>
    </section>
  );
}
