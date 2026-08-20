# ⚡ Expiring Pastebin & Ephemeral Code Snippets

[![Frontend Live](https://img.shields.io/badge/Vercel-Frontend_Live-black?style=flat&logo=vercel)](https://pastebin-expiring-snippets-api-alpha.vercel.app)
[![Backend Live](https://img.shields.io/badge/Render-API_Live-46E3B7?style=flat&logo=render&logoColor=black)](https://pastebin-expiring-snippets.onrender.com)
[![Database](https://img.shields.io/badge/Upstash-Redis_REST-00e9a3?style=flat&logo=redis&logoColor=black)](https://upstash.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_v5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

An encrypted, zero-log, self-destructing code snippet sharing platform built with a **monospace dark hacker terminal** aesthetic. Powered by **React 19**, **Node.js (Express 5)**, and **Upstash Redis**.

---

## 🌐 Live Deployments

- **🖥️ Web Application (Frontend)**: [https://pastebin-expiring-snippets-api-alpha.vercel.app](https://pastebin-expiring-snippets-api-alpha.vercel.app)
- **⚙️ REST API (Backend)**: [https://pastebin-expiring-snippets.onrender.com](https://pastebin-expiring-snippets.onrender.com)
- **📦 Source Repository**: [https://github.com/mmy-lana/pastebin-expiring-snippets](https://github.com/mmy-lana/pastebin-expiring-snippets)

---

## 🎯 What is this project?

**Expiring Pastebin** is an ephemeral text and code storage platform designed for developers, DevOps engineers, and security professionals who need to share sensitive configuration files, keys, SQL queries, or snippets without leaving persistent digital footprints on standard cloud paste services.

### ❓ Why this project?

1. **Zero Lingering Footprint**: Traditional pastebins retain data indefinitely. This platform uses hardware-level TTL evictions in Redis so data disappears the instant it expires.
2. **Burn-on-Read Guarantee**: Critical secrets (e.g. database credentials or one-time tokens) are permanently deleted the moment they are fetched.
3. **PBKDF2 Passphrase Cloaking**: Protected snippets never expose their plaintext payload over the wire until the client unlocks them with the correct secret key.
4. **Read Quota Limits**: Configure self-destruction after $N$ reads to prevent unauthorized link redistribution.

---

## ✨ Features

- 🔥 **Burn After Read**: Automated one-time memory eviction immediately after first access.
- ⏳ **Configurable TTL Eviction**: 5 minutes, 10 minutes, 1 hour, 24 hours, 7 days, or 30 days.
- 🔒 **Cryptographic Password Protection**: Salted PBKDF2 with constant-time equality checks against brute-force timing attacks.
- 👁️ **Read Quota Caps**: Restrict snippets to a maximum number of view counts.
- 💻 **Hacker Monospace Terminal UI**: CRT window frames, phosphor emerald accents, cyber badges, and responsive code viewer.
- 🚀 **Zero-Log Memory Architecture**: Direct serverless REST integration with Upstash Redis.

---

## 🛠️ Tech Stack & Architecture

```
pastebin-expiring-snippets/
├── apps/
│   ├── api/          # Express 5 REST API microservice (Render)
│   └── web/          # React 19 + Vite 8 + Tailwind CSS v4 SPA (Vercel)
└── packages/
    └── shared/       # Shared TypeScript DTO contracts, Zod schemas, and limits
```

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, clsx, tailwind-merge.
- **Backend**: Node.js 22+, Express 5, Upstash Redis SDK, Nanoid, Helmet, CORS.
- **Monorepo Tooling**: Turborepo, pnpm Workspaces, TypeScript 5.
- **Database**: Upstash Serverless Redis (HTTPS REST API).

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+

### 1. Clone & Install

```bash
git clone https://github.com/mmy-lana/pastebin-expiring-snippets.git
cd pastebin-expiring-snippets
pnpm install
```

### 2. Configure Environment Variables

Create `.env` in the root directory:

```env
# Backend (apps/api)
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Upstash Redis (Optional for local dev - uses in-memory fallback if left blank)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token_here

# Frontend (apps/web)
VITE_API_URL=http://localhost:5001
```

### 3. Run Development Server

```bash
pnpm dev
```

- **Web Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5001`
- **Health Check**: `http://localhost:5001/healthz`

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/healthz` | System and Redis connection status |
| `GET` | `/openapi.json` | OpenAPI 3.0 specification |
| `POST` | `/api/snippets` | Deploy a new expiring snippet buffer |
| `GET` | `/api/snippets/:id` | Fetch snippet metadata and code (query `?password=` optional) |
| `POST` | `/api/snippets/:id/unlock` | Unlock password-protected snippet payload |
| `DELETE` | `/api/snippets/:id` | Manually purge a snippet |

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

**Author**: [Muhammad Maulana](https://github.com/mmy-lana)
