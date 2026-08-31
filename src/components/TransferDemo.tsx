"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRightLeft, CheckCircle2, Loader2, Wallet, AlertCircle,
  Send, Receipt, RotateCcw, Inbox, Lock, LogIn,
} from "lucide-react";
import {
  simulateTransfer, getAccount, listRecipients, formatNaira,
  resetDemoBalances, nameEnquiry, loadPersistedBalances, loadCreditAlerts,
  type AlatTransaction, type Account, type CreditAlert,
} from "@/lib/bank-engine";
import { ReceiptModal } from "./ReceiptModal";
import { useAuth } from "@/components/AuthProvider";
import {
  setLatencyProfile, getLatencyProfile, type LatencyProfile,
} from "@/lib/bank-latency";

const STAGES = [
  "connecting", "name_enquiry", "validating", "debiting",
  "routing", "crediting", "notifying", "done",
];

export function TransferDemo() {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState(0);
  const [toAccount, setToAccount] = useState("");
  const [resolvedAccount, setResolvedAccount] = useState<Account | null>(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");
  const [creditAlerts, setCreditAlerts] = useState<CreditAlert[]>([]);
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferStage, setTransferStage] = useState("");
  const [transferLabel, setTransferLabel] = useState("");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [latencyProfile, setLatencyProfileState] = useState<LatencyProfile>("nip_typical");
  const [result, setResult] = useState<{
    success: boolean; message: string;
    tx?: AlatTransaction; creditTx?: AlatTransaction; toAccount?: Account;
  } | null>(null);
  const [history, setHistory] = useState<AlatTransaction[]>([]);
  const [recipients, setRecipients] = useState(() => listRecipients());
  const [receiptTx, setReceiptTx] = useState<AlatTransaction | null>(null);

  const accountId = user?.id ?? "tudy";

  const refreshBalances = useCallback(() => {
    setBalance(getAccount(accountId)?.balance ?? 0);
    setRecipients(listRecipients());
  }, [accountId]);

  const handleReset = () => {
    resetDemoBalances();
    setBalance(2_000_000);
    setHistory([]);
    setResult(null);
    setCreditAlerts([]);
    setResolvedAccount(null);
    setToAccount("");
    setAmount("");
    setNarration("");
    setRecipients([]);
  };

  useEffect(() => {
    loadPersistedBalances();
    setCreditAlerts(loadCreditAlerts());
    refreshBalances();
  }, [refreshBalances]);

  useEffect(() => {
    const num = toAccount.trim().replace(/\s/g, "");
    setResolvedAccount(null);
    setEnquiryError("");
    if (!/^\d{10}$/.test(num)) return;
    let cancelled = false;
    setEnquiryLoading(true);
    nameEnquiry(num).then((res) => {
      if (cancelled) return;
      setEnquiryLoading(false);
      if (res.found) setResolvedAccount(res.account);
      else setEnquiryError(res.message);
    });
    return () => { cancelled = true; };
  }, [toAccount]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = parseFloat(amount.replace(/,/g, ""));
    if (!resolvedAccount || !amt || amt <= 0) return;
    setLoading(true);
    setResult(null);
    setTransferStage("connecting");
    setLatencyMs(null);
    const res = await simulateTransfer({
      fromId: accountId,
      toAccountNumber: resolvedAccount.accountNumber,
      amount: amt,
      narration: narration || undefined,
      onStage: (stage, label) => {
        setTransferStage(stage);
        setTransferLabel(label);
      },
    });
    setLoading(false);
    setResult(res);
    if (res.latencyMs) setLatencyMs(res.latencyMs);
    if (res.success && res.tx) {
      setHistory((h) => [res.tx!, ...h].slice(0, 20));
      setCreditAlerts(loadCreditAlerts());
      refreshBalances();
      setAmount("");
      setNarration("");
    }
  };

  if (authLoading) {
    return (
      <section id="transfer" className="py-24">
        <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-alat-pink" /></div>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="transfer" className="py-24 relative">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-3xl glass p-10 card-glow">
            <Lock className="w-12 h-12 text-alat-pink mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to send money</h2>
            <p className="text-white/50 text-sm mb-6">
              Demo account: Tudy Samuel · ₦2,000,000 starting balance
            </p>
            <Link href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-alat-gradient px-8 py-3.5 font-semibold text-sm hover:opacity-90 transition">
              <LogIn className="w-4 h-4" /> Sign in as Tudy Samuel
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="transfer" className="py-24 relative">
      <div className="absolute inset-0 bg-alat-radial pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Send money. <span className="text-gradient">Any bank. Instantly.</span>
          </h2>
          <p className="text-white/55 max-w-xl mx-auto text-sm">
            Type any 10-digit account number → live name enquiry → NIP transfer with staged latency.
            Beneficiaries get &quot;Tudy Samuel sent you money&quot; credit alerts (~10h).
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl glass p-6 card-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Wallet className="w-4 h-4 text-alat-pink" /> Tudy Samuel
                </div>
                <button onClick={handleReset} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <p className="text-3xl font-bold tracking-tight">{formatNaira(balance)}</p>
              <p className="text-xs text-white/40 mt-1">0112233445 · ALAT by Wema</p>
            </div>

            <div className="rounded-3xl glass p-5">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <Inbox className="w-4 h-4 text-emerald-400" /> Credit alerts
              </div>
              {creditAlerts.length === 0 ? (
                <p className="text-xs text-white/40">No incoming alerts yet. Send a transfer to generate one.</p>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {creditAlerts.slice(0, 8).map((a) => (
                    <li key={a.id} className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs">
                      <p className="text-emerald-300 font-medium">{a.message}</p>
                      <p className="text-white/50 mt-0.5">
                        +{formatNaira(a.amount)} → {a.toName} · {a.toAccountNumber}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl glass p-4">
              <p className="text-xs text-white/50 mb-2">NIP latency profile</p>
              <select
                value={latencyProfile}
                onChange={(e) => {
                  const v = e.target.value as LatencyProfile;
                  setLatencyProfile(v);
                  setLatencyProfileState(v);
                }}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
              >
                <option value="nip_optimal">NIP optimal (2–8s)</option>
                <option value="nip_typical">NIP typical (8–22s)</option>
                <option value="nip_degraded">NIP degraded (20–45s)</option>
                <option value="nip_stressed">NIP stressed (40–90s)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-3xl glass p-6 sm:p-8 card-glow">
            <form onSubmit={handleTransfer} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Account number (any 10 digits)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="0123456789"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-alat-pink/50 font-mono tracking-wider"
                />
                {enquiryLoading && (
                  <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Name enquiry…
                  </p>
                )}
                {enquiryError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {enquiryError}
                  </p>
                )}
                {resolvedAccount && (
                  <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                    <p className="font-medium text-emerald-300">{resolvedAccount.name}</p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {resolvedAccount.bank} · {resolvedAccount.accountNumber}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      Current balance: {formatNaira(resolvedAccount.balance)}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Amount (₦)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="50000"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-alat-pink/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Narration (optional)</label>
                  <input
                    type="text"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="For groceries"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-alat-pink/50"
                  />
                </div>
              </div>

              {loading && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                  {STAGES.filter((s) => s !== "done").map((s) => {
                    const cur = STAGES.indexOf(transferStage || "connecting");
                    const idx = STAGES.indexOf(s);
                    const done = idx < cur;
                    const active = s === transferStage;
                    return (
                      <div key={s} className={`flex items-center gap-2 text-xs ${done ? "text-emerald-400" : active ? "text-alat-pink" : "text-white/30"}`}>
                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                        <span>{transferLabel && active ? transferLabel : s.replace(/_/g, " ")}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !resolvedAccount || !amount}
                className="w-full rounded-full bg-alat-gradient py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                ) : (
                  <><Send className="w-4 h-4" /> Transfer now</>
                )}
              </button>
            </form>

            {result && (
              <div className={`mt-6 rounded-2xl p-4 border ${result.success ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                <p className={`text-sm font-medium ${result.success ? "text-emerald-300" : "text-red-300"}`}>
                  {result.message}
                </p>
                {result.success && result.tx && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setReceiptTx(result.tx!)}
                      className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10"
                    >
                      <Receipt className="w-3.5 h-3.5" /> View receipt
                    </button>
                    {latencyMs != null && (
                      <span className="text-xs text-white/40 self-center">
                        Completed in {(latencyMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                )}
                {result.success && result.creditTx && (
                  <p className="text-xs text-emerald-400/80 mt-2">
                    Credit side: &quot;{result.creditTx.title}&quot; · +{formatNaira(result.creditTx.amount)}
                    {result.toAccount && <> · new balance {formatNaira(result.toAccount.balance)}</>}
                  </p>
                )}
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-white/50 mb-2">Recent transfers</p>
                <ul className="space-y-2">
                  {history.slice(0, 5).map((tx) => (
                    <li key={tx.tranId} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                      <div>
                        <p className="text-white/80">{tx.title}</p>
                        <p className="text-white/40">{tx.destinationAccountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/90">-{formatNaira(tx.amount)}</p>
                        <button onClick={() => setReceiptTx(tx)} className="text-alat-pink hover:underline">
                          Receipt
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipients.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-white/50 mb-2">Recent paid</p>
                <div className="flex flex-wrap gap-2">
                  {recipients.slice(0, 6).map((r) => (
                    <button
                      key={r.accountNumber}
                      type="button"
                      onClick={() => setToAccount(r.accountNumber)}
                      className="rounded-full glass px-3 py-1.5 text-xs hover:bg-white/10"
                    >
                      {r.name.split(" ")[0]} · {r.accountNumber.slice(-4)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReceiptModal tx={receiptTx} onClose={() => setReceiptTx(null)} />
    </section>
  );
}
