/**
 * NIP-inspired latency simulation for ALAT / interbank transfers.
 *
 * Real-world anchors (NIBSS Instant Payment):
 * - Customer credit is online real-time; interbank settlement is deferred net (DNS).
 * - Most NIP txs complete in well under 10s; many sub-second at the switch.
 * - NIBSS has tightened max processing targets (~20s class; older reports cited ~45s).
 * - End-to-end app experience often feels like ~10–30s (channel + bank + NIP + notify).
 * - CBN Instant Payment rules: delayed application of inward NIP beyond 4 minutes is sanctionable.
 *
 * Our profiles stretch UX-visible stages so the demo is readable, while keeping
 * totals in realistic NIP / channel bands.
 */

export type LatencyProfile =
  | "nip_optimal"
  | "nip_typical"
  | "nip_degraded"
  | "nip_stressed";

const STAGE_WEIGHTS: Record<string, number> = {
  connecting: 0.08,
  name_enquiry: 0.12,
  validating: 0.10,
  debiting: 0.12,
  routing: 0.28,
  crediting: 0.18,
  notifying: 0.12,
};

const PROFILES: Record<
  LatencyProfile,
  {
    label: string;
    description: string;
    transferTotal: [number, number];
    nameEnquiry: [number, number];
  }
> = {
  nip_optimal: {
    label: "NIP optimal",
    description: "Top-tier path — sub‑10s end-to-end, switch often sub‑second",
    transferTotal: [2_500, 8_000],
    nameEnquiry: [150, 500],
  },
  nip_typical: {
    label: "NIP typical",
    description: "Common retail experience — ~10–25s including channel UX",
    transferTotal: [8_000, 22_000],
    nameEnquiry: [300, 900],
  },
  nip_degraded: {
    label: "NIP degraded",
    description: "Slow receiving bank / soft retries — still under hard SLA",
    transferTotal: [20_000, 45_000],
    nameEnquiry: [600, 1_500],
  },
  nip_stressed: {
    label: "NIP stressed",
    description: "Congestion near historical max windows — rare, painful UX",
    transferTotal: [40_000, 90_000],
    nameEnquiry: [1_000, 2_500],
  },
};

const ALIAS: Record<string, LatencyProfile> = {
  fast: "nip_optimal",
  normal: "nip_typical",
  slow: "nip_degraded",
  congested: "nip_stressed",
  nip_optimal: "nip_optimal",
  nip_typical: "nip_typical",
  nip_degraded: "nip_degraded",
  nip_stressed: "nip_stressed",
};

let currentProfile: LatencyProfile = "nip_typical";

export function setLatencyProfile(profile: LatencyProfile | string) {
  currentProfile = ALIAS[profile] ?? "nip_typical";
}

export function getLatencyProfile(): LatencyProfile {
  return currentProfile;
}

export function listLatencyProfiles(): {
  id: LatencyProfile;
  label: string;
  description: string;
  transferTotal: [number, number];
}[] {
  return (Object.keys(PROFILES) as LatencyProfile[]).map((id) => ({
    id,
    label: PROFILES[id].label,
    description: PROFILES[id].description,
    transferTotal: PROFILES[id].transferTotal,
  }));
}

function rand([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function simulateNameEnquiryLatency(): Promise<number> {
  const ms = Math.round(rand(PROFILES[currentProfile].nameEnquiry));
  await delay(ms);
  return ms;
}

export type TransferStage =
  | "connecting"
  | "name_enquiry"
  | "validating"
  | "debiting"
  | "routing"
  | "crediting"
  | "notifying"
  | "done";

export const TRANSFER_STAGE_LABELS: Record<TransferStage, string> = {
  connecting: "Connecting to bank gateway…",
  name_enquiry: "Name enquiry (NUBAN lookup)…",
  validating: "Validating limits & fraud checks…",
  debiting: "Debiting Tudy Samuel’s account…",
  routing: "Routing via NIP (NIBSS Instant Payment)…",
  crediting: "Receiving bank crediting beneficiary…",
  notifying: "Sending credit alert…",
  done: "Complete — customer value delivered",
};

const STAGE_ORDER: TransferStage[] = [
  "connecting",
  "name_enquiry",
  "validating",
  "debiting",
  "routing",
  "crediting",
  "notifying",
  "done",
];

export async function runTransferWithLatency(
  onStage: (stage: TransferStage, label: string, elapsedMs: number) => void
): Promise<{
  totalMs: number;
  stages: { stage: TransferStage; ms: number }[];
  profile: LatencyProfile;
}> {
  const profile = currentProfile;
  const totalTarget = Math.round(rand(PROFILES[profile].transferTotal));
  const stages: { stage: TransferStage; ms: number }[] = [];
  let elapsed = 0;

  const activeStages = STAGE_ORDER.filter((s) => s !== "done");
  const weightSum = activeStages.reduce(
    (sum, s) => sum + (STAGE_WEIGHTS[s] ?? 0.1),
    0
  );

  for (const stage of STAGE_ORDER) {
    if (stage === "done") {
      onStage(stage, TRANSFER_STAGE_LABELS[stage], elapsed);
      break;
    }
    const share = (STAGE_WEIGHTS[stage] ?? 0.1) / weightSum;
    const jitter = 0.85 + Math.random() * 0.3;
    const ms = Math.max(80, Math.round(totalTarget * share * jitter));

    onStage(stage, TRANSFER_STAGE_LABELS[stage], elapsed);
    await delay(ms);
    stages.push({ stage, ms });
    elapsed += ms;
  }

  return { totalMs: elapsed, stages, profile };
}

export const NIP_REFERENCE = {
  customerValue: "Instant (seconds) — funds available before interbank settlement",
  settlementModel: "Deferred Net Settlement (DNS) via CBN RTGS in scheduled sessions",
  typicalMax: "~20s processing target (NIBSS); most txs much faster",
  sanctionHint: "CBN: delayed inward NIP credit beyond 4 minutes is sanctionable",
  availability: "24/7/365",
} as const;
