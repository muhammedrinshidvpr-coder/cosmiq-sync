# ⚡ CosmIQ Sync

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

**Transfer Code. Not Credentials.** A frictionless, zero-login, auto-destructing workspace built specifically for fast-paced engineering labs and public PCs.

[**Live Demo**](https://your-vercel-link-here.vercel.app) | [**Report a Bug**](https://github.com/your-github-username/cosmiq-sync/issues)

---

## 🎯 The Problem
Engineering students constantly need to move code protocols, lab outputs, and screenshots from public lab computers to their personal devices. The current solutions—emailing files to yourself or leaving WhatsApp Web logged in on shared PCs—are slow, frustrating, and a massive privacy risk.

## 💡 The Solution
**CosmIQ Sync** acts as a secure, temporary data tunnel between devices. No accounts, no passwords, no traces left behind.

### Key Features
* **Zero-Auth Architecture:** Bypasses traditional login friction. Generate a random 5-digit session code on the sender device and enter it on the receiver to instantly connect.
* **Real-Time Sync:** Drop code snippets or upload image assets and watch them appear instantly on the connected device.
* **Auto-Destructing Rooms:** Built with a PostgreSQL `pg_cron` scheduled job that acts as a digital janitor. After 24 hours, the server automatically vaporizes the room, cascading the deletion to all associated text and media files in the storage bucket.

---

## 🏗️ Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** Supabase (PostgreSQL)
* **Storage:** Supabase Object Storage Buckets
* **Hosting:** Vercel

---

## 🚀 Local Development Setup

Want to run CosmIQ Sync locally? Follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/your-github-username/cosmiq-sync.git](https://github.com/your-github-username/cosmiq-sync.git)
cd cosmiq-sync
