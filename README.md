# 🐧 Pingui Alert

> **The Cute Messenger for Your Ugly Errors.**  
> Receive critical alerts in Telegram without the boilerplate. Secure, Private, and Developer-First.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Runtime](https://img.shields.io/badge/runtime-Deno-black.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)

## 🤔 Why Pingui?

Developers love Telegram for notifications, but setting up a bot, managing tokens, handling rate limits, and maintaining a server just to send a "Database Down" alert is overkill.

**Pingui Alert** solves this by providing a unified standard:
1.  **Instant SaaS:** Use our hosted bot (`@PinguiAlertBot`) for side projects and hackathons. Setup in seconds.
2.  **Privacy-First Enterprise:** Self-host the backend for total control. Your data never leaves your infrastructure.
3.  **Alerts, NOT Logs:** Designed strictly for critical, actionable events. We are not a log dump; we are your emergency pager.

---

## 🚀 Quick Start

### 1. Install the Client
(Coming soon to JSR / NPM)

### 2. Send an Alert
```typescript
import { Pingui } from "@pingui/client";

// Initialize with your API Key (Get it from @PinguiAlertBot)
const pingui = new Pingui("YOUR_API_KEY");

// Send a critical alert
await pingui.critical("🔥 Production DB is unresponsive!");

// Send a warning
await pingui.warning("⚠️ High memory usage detected: 85%");
```

---

## 🔒 Security & Privacy

We take security seriously. This project is **100% Open Source** to ensure transparency.

*   **No Data Persistence:** We do not store your alert content. We simply relay it to Telegram.
*   **Self-Hostable:** Don't trust us? You shouldn't have to. Clone this repo, run the server, and point the client to your own instance.
*   **Scoped Tokens:** API Keys are scoped to specific channels/chats.

---

## 🛠️ Architecture

This project is a Monorepo built with **Deno 🦕**:

*   **`/client`**: Lightweight SDK for Node.js, Deno, and Python (planned).
*   **`/server`**: High-performance API Gateway built with **Hono**. Handles rate-limiting, authentication, and Telegram delivery.

## 🤝 Contributing

We welcome contributions! Whether it's fixing a bug, adding a language SDK, or improving documentation.

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
