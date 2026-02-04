# JovenVA Internal Operation System

A comprehensive internal management platform designed for JovenVA, streamlining operations through attendance tracking, task scheduling, and administrative oversight. This system serves as the central hub for JovenVA's internal workflows.

## 🚀 Project Overview

This tool is the core internal operation system for JovenVA. It is designed to modernize and automate daily business processes including:
- **Attendance Management (DTR)**: Precise tracking of daily time records for all team members.
- **Task Scheduling**: Advanced module for managing daily tasks, including support for overnight shifts.
- **Admin Dashboard**: Centralized control panel for oversight, reporting, and system configuration.
- **Future Ready**: Built with a modular architecture to support future expansions such as payroll integration, project management, and more.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

## ✨ Key Features

- **DTR Tracking**: Clock-in/out system with real-time status updates.
- **Dynamic Task Management**: Full CRUD for daily tasks with status tracking.
- **Real-time Notifications**: Instant updates for announcements and task changes.
- **Responsive Design**: Fully optimized for both desktop and mobile views.
- **Advanced Admin Tools**: Detailed logs, feedback systems, and user management.

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- Supabase Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd jovenva-attendance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the system in action.

## 🔮 Roadmap

- [ ] Project Management Module
- [ ] Employee Performance Analytics
- [ ] Advanced Reporting Exports (PDF/Excel)

---
Developed with ❤️ by the JovenVA Team.
