"use client";

import { Mic } from "lucide-react";

const commands = [
  "“Hi SAW, how much did I spend on food this week?”",
  "“Hi SAW, apply for ₦30,000 loan, repay in 3 months”",
  "“Hey SAW, create a new savings goal called Vacation”",
  "“Hey SAW, buy ₦2,000 airtime for my MTN number”",
];

export function VoiceSection() {
  return (
    <section id="voice" className="py-24 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-alat-pink/15 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-alat-pink mb-6">
              <Mic className="w-3.5 h-3.5" />
              New · Voice Banking
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Just say it.{" "}
              <span className="text-gradient">SAW handles the rest.</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              SAW is your smart ALAT voice assistant. Gender-customisable, adapts
              to your voice patterns, and processes end-to-end transactions with
              an extra passcode layer for security.
            </p>
            <a
              href="https://alat.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-alat-gradient px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Experience SAW on ALAT
            </a>
          </div>

          <div className="space-y-4">
            {commands.map((cmd, i) => (
              <div
                key={i}
                className="rounded-2xl glass p-5 text-left hover:bg-white/[0.07] transition animate-float"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <p className="text-white/90 font-medium">{cmd}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
