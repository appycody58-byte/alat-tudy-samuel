"use client";

import { ArrowRight, Mic, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-alat-purple/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-alat-pink/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/80 mb-8 animate-slide-up">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Trusted by 5M+ Nigerians · Fully licensed by CBN
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
          Banking that{" "}
          <span className="text-gradient">listens, learns</span>
          <br />
          &amp; acts for you
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 mb-10 animate-slide-up">
          Meet SAW — your voice assistant on ALAT. Check balances, send money,
          apply for loans, and create savings goals — hands-free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
          <a
            href="https://alat.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-alat-gradient px-8 py-3.5 text-base font-semibold shadow-xl hover:opacity-90 transition group"
          >
            Start banking free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </a>
          <a
            href="#voice"
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-3.5 text-base font-medium hover:bg-white/10 transition"
          >
            <Mic className="w-4 h-4 text-alat-pink" />
            Try voice banking
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {[
            { icon: Mic, label: "Voice Banking (SAW)" },
            { icon: Zap, label: "Instant Loans" },
            { icon: Shield, label: "NDIC Insured" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-white/80 animate-float"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            >
              <Icon className="w-4 h-4 text-alat-pink" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
