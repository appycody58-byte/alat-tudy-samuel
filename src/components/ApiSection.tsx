"use client";

import { Code2, Key, Layers, Rocket } from "lucide-react";

const products = [
  { title: "Wallet Services", desc: "Create customized transaction wallets with full banking capabilities." },
  { title: "Account Creation & KYC", desc: "Open higher-tier accounts, face biometric auth, address verification." },
  { title: "Get Statement API", desc: "Pull transaction statements for analytics and insights." },
  { title: "Airtime & Data / Bills", desc: "Programmatic airtime, data, and bill payments." },
  { title: "Card Management", desc: "Request and manage physical cards via API." },
  { title: "Direct Debit & Pay with Bank", desc: "One-time and recurring debits with ALAT Authenticator consent." },
];

export function ApiSection() {
  return (
    <section id="apis" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Build on <span className="text-gradient">ALAT Open APIs</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Official developer portal at playground.alat.ng — wallets, KYC,
            statements, payments, cards, and more.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {products.map((p) => (
            <div key={p.title} className="rounded-2xl glass p-6 hover:bg-white/[0.07] transition">
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-white/55">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass p-8 md:p-10 card-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to integrate?</h3>
              <p className="text-white/60 max-w-md">
                Register on the ALAT developer portal, get your subscription key
                + API key, then plug into the client we scaffolded for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://playground.alat.ng/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-alat-gradient px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
                <Rocket className="w-4 h-4" /> Open Developer Portal
              </a>
              <a href="#developer"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10 transition">
                <Code2 className="w-4 h-4" /> View client code
              </a>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Key, label: "Get credentials", sub: "Subscription + API keys" },
              { icon: Layers, label: "Pick products", sub: "Wallets, KYC, Bills…" },
              { icon: Rocket, label: "Go live", sub: "Ship your integration" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-alat-gradient/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-alat-pink" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-white/50">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
