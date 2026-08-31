/**
 * Simulated ALAT-style transfer engine
 * Tudy Samuel = only fixed account holder.
 * Any other 10-digit NUBAN → live name enquiry generates account details, then payment.
 * Balances + credit alerts persist ~10 hours.
 */

export type Account = {
  id: string;
  name: string;
  bank: string;
  bankCode: string;
  accountNumber: string;
  balance: number;
};

export type AlatTransaction = {
  title: string;
  amount: number;
  type: "InterBank" | "IntraBank" | "Airtime" | "Bills" | string;
  date: string;
  narration: string;
  status: "Default" | "Successful" | "Failed" | "Pending" | string;
  creditType: "Default" | "Credit" | "Debit" | string;
  sender: string;
  senderAccountNumber: string;
  destinationBank: string;
  destinationAccountNumber: string;
  recieverName: string;
  referenceId: string;
  isViewReceiptEnabled: boolean;
  tranId: string;
};

export type AlatStatementResponse = {
  data: AlatTransaction[];
  message: string;
  status: boolean;
};

const NIGERIAN_BANKS: { name: string; code: string }[] = [
  { name: "ALAT by Wema", code: "035" },
  { name: "GTBank", code: "058" },
  { name: "Access Bank", code: "044" },
  { name: "Zenith Bank", code: "057" },
  { name: "UBA", code: "033" },
  { name: "First Bank", code: "011" },
  { name: "Stanbic IBTC", code: "221" },
  { name: "Fidelity Bank", code: "070" },
  { name: "Union Bank", code: "032" },
  { name: "Sterling Bank", code: "232" },
  { name: "Polaris Bank", code: "076" },
  { name: "FCMB", code: "214" },
];

const FIRST_NAMES = [
  "Ada", "Chidi", "Funke", "Ifeanyi", "Ngozi", "Emeka", "Amina", "Tunde",
  "Blessing", "Ibrahim", "Chioma", "Segun", "Fatima", "Obinna", "Yetunde",
  "Kemi", "Bola", "Hassan", "Grace", "Daniel", "Mary", "Joseph", "Ruth",
  "Samuel", "Peace", "Victor", "Joy", "Michael", "Esther", "David",
];

const LAST_NAMES = [
  "Okafor", "Eze", "Adeyemi", "Okoro", "Nwosu", "Bello", "Okonkwo", "Musa",
  "Ibrahim", "Adebayo", "Ogunleye", "Chukwu", "Lawal", "Nnamdi", "Balogun",
  "Okeke", "Suleiman", "Afolabi", "Danladi", "Uche", "Obi", "Yusuf", "Eke",
];

/** Only fixed account: Tudy Samuel */
export const DEMO_ACCOUNTS: Record<string, Account> = {
  tudy: {
    id: "tudy",
    name: "Tudy Samuel",
    bank: "ALAT by Wema",
    bankCode: "035",
    accountNumber: "0112233445",
    balance: 2_000_000,
  },
};

/** Runtime registry of accounts discovered via name enquiry */
const dynamicAccounts: Record<string, Account> = {};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Generate a fresh but deterministic account from any 10-digit NUBAN */
export function generateAccountFromNuban(accountNumber: string): Account {
  const cleaned = accountNumber.trim().replace(/\s/g, "");
  const h = hashString(cleaned);
  const bank = NIGERIAN_BANKS[h % NIGERIAN_BANKS.length];
  const first = FIRST_NAMES[h % FIRST_NAMES.length];
  const last = LAST_NAMES[(h * 7) % LAST_NAMES.length];
  const startBal = 5_000 + (h % 500_000);

  return {
    id: `ext-${cleaned}`,
    name: `${first} ${last}`,
    bank: bank.name,
    bankCode: bank.code,
    accountNumber: cleaned,
    balance: startBal,
  };
}

function getOrCreateExternal(accountNumber: string): Account {
  const cleaned = accountNumber.trim().replace(/\s/g, "");
  if (cleaned === DEMO_ACCOUNTS.tudy.accountNumber) {
    return { ...DEMO_ACCOUNTS.tudy };
  }
  if (dynamicAccounts[cleaned]) {
    return { ...dynamicAccounts[cleaned] };
  }
  const generated = generateAccountFromNuban(cleaned);
  dynamicAccounts[cleaned] = generated;
  return { ...generated };
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateRef(): string {
  return `ALAT${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function generateTranId(): string {
  return `TRN${Date.now()}${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function nameEnquiry(
  accountNumber: string
): Promise<{ found: true; account: Account } | { found: false; message: string }> {
  const { simulateNameEnquiryLatency } = await import("./bank-latency");
  await simulateNameEnquiryLatency();
  const cleaned = accountNumber.trim().replace(/\s/g, "");

  if (!/^\d{10}$/.test(cleaned)) {
    return { found: false, message: "Enter a valid 10-digit account number" };
  }

  if (cleaned === DEMO_ACCOUNTS.tudy.accountNumber) {
    return { found: false, message: "Cannot transfer to your own account" };
  }

  const account = getOrCreateExternal(cleaned);
  return { found: true, account };
}

const BALANCE_KEY = "alat_demo_balances_v2";
const DYNAMIC_KEY = "alat_demo_dynamic_v2";
const BALANCE_TTL_MS = 10 * 60 * 60 * 1000;

export function loadPersistedBalances(): void {
  if (typeof window === "undefined") return;
  try {
    const dynRaw = localStorage.getItem(DYNAMIC_KEY);
    if (dynRaw) {
      const parsed = JSON.parse(dynRaw) as {
        savedAt: number;
        accounts: Record<string, Account>;
      };
      if (Date.now() - parsed.savedAt <= BALANCE_TTL_MS) {
        Object.assign(dynamicAccounts, parsed.accounts);
      } else {
        localStorage.removeItem(DYNAMIC_KEY);
      }
    }

    const raw = localStorage.getItem(BALANCE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      savedAt: number;
      balances: Record<string, number>;
    };
    if (Date.now() - parsed.savedAt > BALANCE_TTL_MS) {
      localStorage.removeItem(BALANCE_KEY);
      return;
    }
    if (parsed.balances.tudy != null) {
      DEMO_ACCOUNTS.tudy.balance = parsed.balances.tudy;
    }
    for (const [num, bal] of Object.entries(parsed.balances)) {
      if (num === "tudy") continue;
      if (dynamicAccounts[num]) {
        dynamicAccounts[num].balance = bal;
      }
    }
  } catch {
    /* ignore */
  }
}

export function persistBalances(): void {
  if (typeof window === "undefined") return;
  const balances: Record<string, number> = {
    tudy: DEMO_ACCOUNTS.tudy.balance,
  };
  for (const [num, acc] of Object.entries(dynamicAccounts)) {
    balances[num] = acc.balance;
  }
  localStorage.setItem(
    BALANCE_KEY,
    JSON.stringify({ savedAt: Date.now(), balances })
  );
  localStorage.setItem(
    DYNAMIC_KEY,
    JSON.stringify({ savedAt: Date.now(), accounts: dynamicAccounts })
  );
}

const ALERTS_KEY = "alat_demo_credit_alerts_v2";

export type CreditAlert = {
  id: string;
  message: string;
  amount: number;
  from: string;
  toName: string;
  toAccountNumber: string;
  referenceId: string;
  createdAt: string;
  expiresAt: string;
};

export function loadCreditAlerts(): CreditAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as CreditAlert[];
    const now = Date.now();
    const active = list.filter((a) => new Date(a.expiresAt).getTime() > now);
    if (active.length !== list.length) {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(active));
    }
    return active;
  } catch {
    return [];
  }
}

export function saveCreditAlert(alert: CreditAlert): void {
  if (typeof window === "undefined") return;
  const list = loadCreditAlerts();
  list.unshift(alert);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(list.slice(0, 50)));
}

export function clearCreditAlerts(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ALERTS_KEY);
  localStorage.removeItem(BALANCE_KEY);
  localStorage.removeItem(DYNAMIC_KEY);
}

export async function simulateTransfer(params: {
  fromId: string;
  toAccountNumber: string;
  amount: number;
  narration?: string;
  onStage?: (
    stage: string,
    label: string,
    elapsedMs: number
  ) => void;
}): Promise<{
  success: boolean;
  message: string;
  tx?: AlatTransaction;
  creditTx?: AlatTransaction;
  toAccount?: Account;
  latencyMs?: number;
}> {
  const { runTransferWithLatency } = await import("./bank-latency");
  const { totalMs } = await runTransferWithLatency((stage, label, elapsed) => {
    params.onStage?.(stage, label, elapsed);
  });

  const from =
    params.fromId === "tudy"
      ? DEMO_ACCOUNTS.tudy
      : dynamicAccounts[params.fromId] || DEMO_ACCOUNTS[params.fromId];

  if (!from) {
    return { success: false, message: "Source account not found" };
  }

  const cleaned = params.toAccountNumber.trim().replace(/\s/g, "");
  if (!/^\d{10}$/.test(cleaned)) {
    return { success: false, message: "Invalid destination account number" };
  }
  if (cleaned === from.accountNumber) {
    return { success: false, message: "Cannot transfer to yourself" };
  }

  const to = getOrCreateExternal(cleaned);

  if (params.amount <= 0) {
    return { success: false, message: "Amount must be greater than zero" };
  }
  if (params.amount > from.balance) {
    return {
      success: false,
      message: `Insufficient funds. Available: ${formatNaira(from.balance)}`,
    };
  }

  from.balance -= params.amount;
  to.balance += params.amount;
  if (from.id === "tudy") {
    DEMO_ACCOUNTS.tudy.balance = from.balance;
  }
  dynamicAccounts[cleaned] = { ...to };

  const referenceId = generateRef();
  const tranId = generateTranId();
  const isIntra = from.bankCode === to.bankCode;
  const now = new Date().toISOString();
  const narration = params.narration || `Transfer to ${to.name}`;

  const tx: AlatTransaction = {
    title: `Transfer to ${to.name}`,
    amount: params.amount,
    type: isIntra ? "IntraBank" : "InterBank",
    date: now,
    narration,
    status: "Successful",
    creditType: "Debit",
    sender: from.name,
    senderAccountNumber: from.accountNumber,
    destinationBank: to.bank,
    destinationAccountNumber: to.accountNumber,
    recieverName: to.name,
    referenceId,
    isViewReceiptEnabled: true,
    tranId,
  };

  const creditTx: AlatTransaction = {
    title: `${from.name} sent you money`,
    amount: params.amount,
    type: isIntra ? "IntraBank" : "InterBank",
    date: now,
    narration: narration || `${from.name} sent you money`,
    status: "Successful",
    creditType: "Credit",
    sender: from.name,
    senderAccountNumber: from.accountNumber,
    destinationBank: to.bank,
    destinationAccountNumber: to.accountNumber,
    recieverName: to.name,
    referenceId,
    isViewReceiptEnabled: true,
    tranId: `${tranId}-CR`,
  };

  persistBalances();
  const expiresAt = new Date(Date.now() + BALANCE_TTL_MS).toISOString();
  saveCreditAlert({
    id: creditTx.tranId,
    message: `${from.name} sent you money`,
    amount: params.amount,
    from: from.name,
    toName: to.name,
    toAccountNumber: to.accountNumber,
    referenceId,
    createdAt: now,
    expiresAt,
  });

  return {
    success: true,
    message: `${from.name} sent ₦${params.amount.toLocaleString()} to ${to.name}. They got a credit alert.`,
    tx,
    creditTx,
    toAccount: { ...to },
    latencyMs: totalMs,
  };
}

export function getStatement(accountId = "tudy"): AlatStatementResponse {
  return {
    data: [],
    message: "Statement retrieved successfully",
    status: true,
  };
}

export function getAccount(id: string): Account | undefined {
  if (id === "tudy") return { ...DEMO_ACCOUNTS.tudy };
  if (DEMO_ACCOUNTS[id]) return { ...DEMO_ACCOUNTS[id] };
  const byId = Object.values(dynamicAccounts).find((a) => a.id === id);
  if (byId) return { ...byId };
  return undefined;
}

export function listRecipients(): Account[] {
  return Object.values(dynamicAccounts).map((a) => ({ ...a }));
}

export function resetDemoBalances() {
  DEMO_ACCOUNTS.tudy.balance = 2_000_000;
  for (const key of Object.keys(dynamicAccounts)) {
    delete dynamicAccounts[key];
  }
  clearCreditAlerts();
  persistBalances();
}

export function findAccountByNumber(
  accountNumber: string
): Account | undefined {
  const cleaned = accountNumber.trim().replace(/\s/g, "");
  if (cleaned === DEMO_ACCOUNTS.tudy.accountNumber) {
    return { ...DEMO_ACCOUNTS.tudy };
  }
  if (dynamicAccounts[cleaned]) return { ...dynamicAccounts[cleaned] };
  return undefined;
}
