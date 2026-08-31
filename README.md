# ALAT by Wema — Tudy Samuel Demo

Full modern Next.js rebuild of the ALAT by Wema experience with a **live interactive transfer engine**.

**Live demo:** https://alat-tudy-samuel.vercel.app

## Account holder

| Field | Value |
|-------|--------|
| Name | **Tudy Samuel** |
| Phone | `08098765432` |
| Email | `tudy.samuel@alat.ng` |
| PIN | `5678` |
| Account | `0112233445` (ALAT by Wema) |
| Starting balance | ₦2,000,000 |

## Features

- Dark purple/pink glassmorphism landing page (Hero, Features, Voice Banking, APIs, Developers)
- Demo login (Tudy Samuel only) with session in `localStorage`
- **Any 10-digit NUBAN** → live name enquiry generates holder name + bank + starting balance
- Transfer flow with realistic **NIP latency stages** (connecting → name enquiry → debit → NIP route → credit → alert)
- Double-entry ledger: Tudy is debited; beneficiary is credited
- Credit alert: **“Tudy Samuel sent you money”**
- Balances + alerts persist ~**10 hours**
- Receipt modal matching ALAT transaction JSON schema
- Credit-side inbox of recent incoming alerts

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 → Login → Transfer.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS
- Framer Motion · Lucide icons

## Not official

Demo / learning remix only. Not affiliated with Wema Bank or ALAT.
