"use client";

export function DeveloperSection() {
  const snippet = `import { AlatClient } from "@/lib/alat-api";

const client = new AlatClient({
  subscriptionKey: process.env.ALAT_SUBSCRIPTION_KEY!,
  apiKey: process.env.ALAT_API_KEY!,
});

// Name enquiry
const result = await client.nameEnquiry("0123456789", "035");

// Create wallet
await client.createWallet({
  firstName: "Ada",
  lastName: "Okafor",
  phone: "08012345678",
});`;

  return (
    <section id="developer" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            TypeScript client <span className="text-gradient">ready to use</span>
          </h2>
          <p className="text-white/55 max-w-xl mx-auto text-sm">
            Scaffolded client in <code className="text-alat-pink">src/lib/alat-api.ts</code>.
            Plug in your keys from playground.alat.ng.
          </p>
        </div>
        <pre className="rounded-2xl glass p-6 overflow-x-auto text-sm text-white/80 font-mono leading-relaxed">
          <code>{snippet}</code>
        </pre>
      </div>
    </section>
  );
}
