# 🎬 ThePixFlow: Ultimate Video Agency Command Center

**ThePixFlow** is a state-of-the-art, high-performance SaaS platform designed for modern video production agencies. Built with a "Data-First" philosophy, it automates the full agency lifecycle: from Lead Generation and Client Intake to High-Speed Delivery and Timestamped Feedback.

![ThePixFlow Vision](https://img.shields.io/badge/UI-Insta--Dark-blueviolet?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016--Turbopack-black?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Backend-Firebase--Firestore-orange?style=for-the-badge)

---

## 💎 The Design Philosophy: "Insta-Dark"

ThePixFlow rejects generic dashboard aesthetics. It utilizes a custom **20/45/27 Mathematical Lock Grid** system—a non-scrolling, high-density command center interface inspired by premium dark-mode aesthetics.

- **Background:** `#000000` (Pure Obsidian)
- **Components:** `#0A0A0A` (Glassmorphism based)
- **Borders:** `0.5px` Zinc-800 for razor-sharp precision.

---

## 🚀 Key Features

### 🔐 Multi-Role Architecture (RBAC)

- **Admin Control Center:** Global production visibility, revenue tracking, and editor workload pulse.
- **Client Workspace:** Rapid project creation, library management, and "Frame.io style" video review.
- **Editor Engine:** Seamless delivery pipeline directly to the agency's Google Drive.
- **Marketing CRM:** Lead discovery engine, conversion funnel, and automated content scheduling.

### 📁 Google Drive Backbone (OAuth 2.0 User Flow)

- **No Service Accounts:** Using User-Flow OAuth for maximum security and zero key-creation policy friction.
- **Auto-Sync:** Real-time upload from Editors to specific Drive folders with atomic Firestore status updates.
- **Direct Streaming:** Custom video streaming route bypassing Drive UI for a white-label experience.

### 💬 Precision Feedback Loop

- **Timestamped Comments:** Clients can click on any frame to leave precise feedback.
- **Instant Seek:** Clicking a comment automatically jumps the player to the exact frame.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16.2 (Turbopack Enabled), TypeScript, Tailwind CSS.
- **Backend:** Firebase 12.12 (Auth & Firestore).
- **Storage/API:** Google Drive V3 API, OAuth 2.0 (Offline Access).
- **Animations:** Framer Motion.
- **Analytics:** Recharts (Responsive Container Logic).

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/ThePixFlow.git
cd ThePixFlow
```

### 2. Environment Setup

Create a `.env` file in the root and fill it using the provided `.env.example`:

```bash
cp .env.example .env
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 🌐 Deployment Logic

ThePixFlow is optimized for **Vercel** and **GitHub** CI/CD.

1. All client-side Firebase keys must be prefixed with `NEXT_PUBLIC_`.
2. Google OAuth Redirect URIs must be updated in the Google Cloud Console for production.
3. Use the `vercel_deployment_checklist.md` for a 100% stable launch.

---

## 🛡 Security & Resilience

- **Auth Guards:** Strict RBAC prevents unauthorized role access via URL manipulation.
- **Resilient Uploads:** Automatic retry logic in `googleDrive.ts` handles API throughput limits.
- **Atomic Transactions:** Project status only updates when the storage delivery is verified.

---

## 📄 License

Controlled Internal Property. Unauthorized duplication is prohibited.

Designed with ❤️ by **ThePixFlow Team**.
