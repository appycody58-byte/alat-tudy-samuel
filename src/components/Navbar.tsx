"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#voice", label: "Voice Banking" },
  { href: "/#transfer", label: "Send Money" },
  { href: "/#apis", label: "Open APIs" },
  { href: "/#developer", label: "Developers" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 flex items-center justify-between rounded-2xl glass px-4 py-3 card-glow">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-alat-gradient flex items-center justify-center font-bold text-sm shadow-lg">
              A
            </div>
            <span className="font-semibold tracking-tight">
              ALAT <span className="text-alat-muted font-normal">by Wema</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 hover:text-white transition"
              >
                {l.label}
              </a>
            ))}

            {!loading &&
              (user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-full bg-alat-gradient px-5 py-2 text-sm font-medium shadow-lg hover:opacity-90 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign in
                </Link>
              ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl glass p-4 space-y-3 animate-slide-up">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-white/80 hover:text-white py-2"
              >
                {l.label}
              </a>
            ))}
            {!loading &&
              (user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full text-left py-2 text-white/80 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out ({user.name})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center rounded-full bg-alat-gradient px-5 py-2.5 text-sm font-medium"
                >
                  Sign in
                </Link>
              ))}
          </div>
        )}
      </div>
    </header>
  );
}
