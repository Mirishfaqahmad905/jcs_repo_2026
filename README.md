# Jamal College of Science, Mayar — Full-Stack Web Portal & Admin System

Official Web Portal and Administrative Management System for **Jamal College of Science, Mayar** (Dir Lower, Khyber Pakhtunkhwa).

Built with React, TypeScript, Tailwind CSS, Express, and Node.js.

---

## 🏛️ Project Architecture

```text
Jamal College Web Portal
        │
        ▼
   Single Vercel Project / Cloud Container
        │
        ├── Frontend (React + Vite + Tailwind CSS)
        │
        └── API Endpoints (/api/college, /api/faculty, /api/programs, /api/admin/*)
                │
                ▼
          JSON Data Layer (server/data/*.json)
```

### Key Architectural Highlights:
* **Single Deployment Unit**: Frontend and backend API endpoints are unified into one deployment. No separate backend hosting (Render, Railway, Heroku) or separate backend domain needed.
* **Same-Domain Relative API**: All client requests target relative endpoints (`/api/...`). Zero CORS configuration needed and no `localhost` production URL dependencies.
* **Zero External Database Dependency**: Uses local JSON files (`server/data/*.json`) for content persistence without requiring MongoDB, PostgreSQL, or external DB setup.
* **Complete College Portal**: Full public website (Faculty, Programs, Admissions, Notifications, Gallery, Contact, Urdu-to-English AI Translator) + Secure Admin Portal (`/admin`).

---

## 🚀 One-Click Vercel Deployment Instructions

1. **Push to GitHub**: Push this repository to your GitHub account.
2. **Open Vercel**: Go to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
3. **Import Repository**: Select your `jamal-college` GitHub repository.
4. **Environment Variables** (Optional):
   * `GEMINI_API_KEY` (Optional): For AI-powered Urdu to English text translations.
5. **Deploy**: Click **Deploy**. Vercel will automatically build the application and issue your single production URL (`https://your-domain.vercel.app`).

---

## 🛠️ Local Development

To run the application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start single full-stack development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔐 Admin Dashboard Access

* **Admin Portal Route**: `/admin`
* **Default Username**: `jamal`
* **Password Management**: Change password anytime under **Admin Dashboard → Settings & Change Password**.

---

## 💾 Data Persistence Note

The application stores website data in `server/data/*.json` files. For serverless deployments (such as Vercel Functions), runtime disk writes are ephemeral. For long-term persistent administrative edits in serverless environments, data changes can be committed to Git or configured with a persistent cloud storage provider.

---

## 📄 License

Official Portal for Jamal College of Science, Mayar, Dir Lower. All rights reserved.
