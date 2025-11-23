# 🤖 AI Context & Handoff Summary

**Project:** Pingui Alert (formerly `botLogger`)
**Description:** Open-source "Alerts-as-a-Service" for developers to send critical notifications to Telegram via a simple SDK.
**Current Date:** 2025-11-22

---

## 🛠️ Technical Stack & Architecture
- **Runtime:** Deno 🦕 (chosen for speed, security, and TS support).
- **Architecture:** Monorepo (Deno Workspace).
- **Server Framework:** Hono (configured in `deno.json`).
- **Deployment Model:** Hybrid (SaaS for individuals, Self-Hosted for Enterprise).

## 📂 Project Structure
Created at `/Users/juanvicentereyes/Documents/botLogger`:

```text
/botLogger
├── deno.json       # Workspace config + Hono dependency
├── .gitignore      # Standard gitignore
├── README.md       # Branding & Pitch (Pingui Alert)
├── PLAN.md         # 4-Day MVP Sprint Plan
├── AI_SUMMARY.md   # This file
├── /server
│   └── main.ts     # Entry point (Placeholder, needs Hono implementation)
└── /client
    └── mod.ts      # SDK Entry point (Placeholder)
```

## 📝 Key Decisions & Pivot Points
1.  **Pivot to "Alerts":** Shifted focus from "Logging" to "Alerting" to avoid rate limits and privacy concerns.
2.  **Privacy Strategy:** "Open Source First" approach to gain trust from security teams. Code is auditable.
3.  **Branding:** Renamed from "TeleAlert" (Trademark conflict) to **"Pingui Alert"** 🐧.
4.  **Tech Stack:** Switched from Node.js to **Deno** for better DX and native TypeScript support.

## 🚧 Current Status
- **Phase:** Initialization Complete. Ready for Sprint 1.
- **Immediate Next Step:** Implement the Hono server in `/server/main.ts` to handle `POST /alert`.
- **Dependencies:** `hono` added to `deno.json` imports.

## 📜 Command History (Simulated/Executed)
- `deno init` (Manual equivalent via file creation).
- Created `deno.json` with workspace members.
- Created `README.md` with specific "Alerts vs Logs" copy.
- Created `PLAN.md` breaking down the MVP into 4 sprints.
