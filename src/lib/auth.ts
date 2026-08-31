/**
 * Demo auth — Tudy Samuel is the main account holder.
 * He sends to external accounts; they get credit alerts.
 * NOT real security — localStorage session for testing only.
 */

export type DemoUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  accountNumber: string;
};

/** Main account holder */
export const TUDY = {
  phone: "08098765432",
  email: "tudy.samuel@alat.ng",
  pin: "5678",
  user: {
    id: "tudy",
    name: "Tudy Samuel",
    phone: "08098765432",
    email: "tudy.samuel@alat.ng",
    accountNumber: "0112233445",
  } satisfies DemoUser,
} as const;

/** @deprecated aliases for older UI */
export const ACCOUNTS = {
  tudy: TUDY,
  demo: TUDY,
} as const;

export const DEMO_CREDENTIALS = {
  phone: TUDY.phone,
  email: TUDY.email,
  pin: TUDY.pin,
} as const;

export const DEMO_USER = TUDY.user;

const SESSION_KEY = "alat_demo_session";

export type Session = {
  user: DemoUser;
  loggedInAt: string;
};

function normalizeId(value: string): string {
  return value.trim().toLowerCase().replace(/\s/g, "");
}

function matchesTudy(identifier: string): boolean {
  const id = normalizeId(identifier);
  const phone = normalizeId(TUDY.phone);
  return (
    id === phone ||
    id === normalizeId(TUDY.email) ||
    id === phone.replace(/^0/, "234") ||
    id === `+234${phone.slice(1)}` ||
    id === "tudysamuel" ||
    id === "tudy samuel"
  );
}

export function loginWithPin(
  identifier: string,
  pin: string
): { success: true; session: Session } | { success: false; message: string } {
  if (!matchesTudy(identifier)) {
    return {
      success: false,
      message: "Account not found. Sign in as Tudy Samuel: 08098765432",
    };
  }

  if (pin !== TUDY.pin) {
    return { success: false, message: "Incorrect PIN. Tudy Samuel PIN is 5678" };
  }

  const session: Session = {
    user: TUDY.user,
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, session };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}
