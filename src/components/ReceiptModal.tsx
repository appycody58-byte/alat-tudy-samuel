"use client";

import { X, CheckCircle2, Download } from "lucide-react";
import { formatNaira, type AlatTransaction } from "@/lib/bank-engine";

type Props = {
  tx: AlatTransaction | null;
  onClose: () => void;
};

export function ReceiptModal({ tx, onClose }: Props) {
  if (!tx) return null;

  const isCredit = tx.creditType === "Credit";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-3xl bg-alat-navy border border-white/10 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-alat-gradient" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">
                  Transaction receipt
                </p>
                <p className="font-semibold text-lg">
                  {isCredit ? "Money received" : "Money sent"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition text-white/50 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center py-6 rounded-2xl bg-white/5 border border-white/5 mb-6">
            <p
              className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                isCredit ? "text-emerald-400" : "text-white"
              }`}
            >
              {isCredit ? "+" : "-"}
              {formatNaira(tx.amount)}
            </p>
            <p className="text-sm text-white/50 mt-1">{tx.status}</p>
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Title" value={tx.title} />
            <Row label="Narration" value={tx.narration} />
            <Row label="Type" value={tx.type} />
            <Row label="Credit type" value={tx.creditType} />
            <div className="border-t border-white/10 my-2" />
            <Row label="Sender" value={tx.sender} />
            <Row label="Sender account" value={tx.senderAccountNumber} mono />
            <Row label="Receiver" value={tx.recieverName} />
            <Row
              label="Destination account"
              value={tx.destinationAccountNumber}
              mono
            />
            <Row label="Destination bank" value={tx.destinationBank} />
            <div className="border-t border-white/10 my-2" />
            <Row label="Reference ID" value={tx.referenceId} mono />
            <Row label="Transaction ID" value={tx.tranId} mono />
            <Row
              label="Date"
              value={new Date(tx.date).toLocaleString("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full glass py-3 text-sm font-medium hover:bg-white/10 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify(tx, null, 2)],
                  { type: "application/json" }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `alat-receipt-${tx.referenceId}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 rounded-full bg-alat-gradient py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] text-white/30">
            ALAT by Wema · Demo receipt · Not a real bank document
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/40 shrink-0">{label}</span>
      <span
        className={`text-right text-white/90 break-all ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
