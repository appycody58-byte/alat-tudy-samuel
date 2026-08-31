"use client";

import {
  CreditCard,
  Mic,
  Smartphone,
  Wallet,
  PiggyBank,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Banking with SAW",
    description:
      "Talk to SAW — check balances, track spending, send money, buy airtime, or apply for loans. Fully hands-free.",
  },
  {
    icon: CreditCard,
    title: "Virtual & Physical Cards",
    description:
      "Instant virtual cards for online spend. Request a physical card with full control and free delivery.",
  },
  {
    icon: Smartphone,
    title: "Tap & Pay",
    description:
      "Contactless payments between ALAT users in proximity. Fast, secure, no friction.",
  },
  {
    icon: Wallet,
    title: "Instant Loans",
    description:
      "Low-interest short-term loans in one click. Nano loans, school fees advances, and more.",
  },
  {
    icon: PiggyBank,
    title: "Smart Savings Goals",
    description:
      "Create named goals, set targets, and watch your money grow with competitive rates.",
  },
  {
    icon: Send,
    title: "Instant Transfers",
    description:
      "Send money to any bank in Nigeria instantly. No stress, no delays.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade Security",
    description:
      "Biometric login, smart fraud detection, CBN licensed, NDIC insured. Your money is protected.",
  },
  {
    icon: Sparkles,
    title: "ALAT Rewards",
    description:
      "Deals, discounts, travel bookings, insurance, and more — built into the app ecosystem.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-alat-radial pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything you need.{" "}
            <span className="text-gradient">Nothing you don’t.</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            One app. Full banking power. Designed for how you actually live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl glass p-6 hover:bg-white/[0.07] transition card-glow"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-alat-gradient/20 text-alat-pink group-hover:scale-110 transition">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
