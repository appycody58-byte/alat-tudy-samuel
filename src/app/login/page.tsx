"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fingerprint, Loader2, Lock, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { TUDY } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricStep, setBiometricStep] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/#transfer");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(identifier, pin);
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Login failed");
      return;
    }
    setBiometricStep(true);
    await new Promise((r) => setTimeout(r, 1400));
    router.push("/#transfer");
  };

  const fillTudy = () => {
    setIdentifier(TUDY.phone);
    setPin(TUDY.pin);
    setError("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alat-navy">
        <Loader2 className="w-8 h-8 animate-spin text-alat-pink" />
      </div>
    );
  }

  if (biometricStep) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-alat-navy px-4">
        <div className="h-20 w-20 rounded-full bg-alat-gradient/20 flex items-center justify-center mb-6 animate-pulse">
          <Fingerprint className="w-10 h-10 text-alat-pink" />
        </div>
        <p className="text-lg font-medium">Welcome, Tudy Samuel</p>
        <p className="text-sm text-white/50 mt-2">Confirming it’s you…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-alat-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-alat-purple/20 blur-[100px] pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-alat-gradient items-center justify-center font-bold text-xl shadow-lg mb-4">
              A
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Sign in</h1>
            <p className="text-white/50 mt-2 text-sm">
              Account holder · <span className="text-white">Tudy Samuel</span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl glass p-6 sm:p-8 space-y-5 card-glow"
          >
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Phone or email
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="08098765432"
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-alat-pink/50 transition"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">PIN</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="••••"
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-alat-pink/50 transition tracking-widest"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-alat-gradient py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in as Tudy Samuel"
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 border border-emerald-500/20 p-4 text-xs text-white/50 space-y-1">
            <p className="font-medium text-emerald-300/90">
              Account holder · Tudy Samuel
            </p>
            <p>
              Phone: <code className="text-alat-pink">{TUDY.phone}</code>
            </p>
            <p>
              PIN: <code className="text-alat-pink">{TUDY.pin}</code>
            </p>
            <p>Acc: 0112233445 · ALAT by Wema · ₦2,000,000</p>
            <button
              type="button"
              onClick={fillTudy}
              className="text-emerald-400 hover:underline mt-2"
            >
              Fill credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
