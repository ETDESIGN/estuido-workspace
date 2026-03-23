# 🎯 ESTUDIO Dashboard

A modern, responsive dashboard for monitoring and managing NB Studio agents, sessions, and AI models.

## 🚀 Features

- **Real-time Dashboard** - Monitor agent activity, system health, and resource usage
- **Collapsible Sidebar Navigation** - Responsive sidebar with smooth animations
- **Agent Management** - Track active agents, their tasks, and resource consumption
- **System Health** - CPU, memory, and disk monitoring
- **Session Tracking** - View and manage agent sessions (coming soon)
- **Model Management** - Configure and monitor AI models (coming soon)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Fetching**: SWR
- **Charts**: Recharts

## 📦 Installation

```bash
npm install
```

## 🏃 Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── sessions/          # Sessions page
│   ├── models/            # Models page
│   └── settings/          # Settings page
├── components/            # Reusable React components
│   ├── Sidebar.tsx       # Collapsible sidebar
│   ├── SidebarItem.tsx   # Navigation items
│   └── DashboardLayout.tsx # Layout wrapper
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🎨 Navigation

The dashboard features a responsive sidebar with four main sections:

- **Dashboard** (`/`) - Overview of system health and agent activity
- **Sessions** (`/sessions`) - Agent session management
- **Models** (`/models`) - AI model configuration
- **Settings** (`/settings`) - User preferences

### Desktop
- Click the arrow (←/→) to collapse/expand the sidebar
- Click navigation items to switch pages
- Active route is highlighted

### Mobile
- Tap the hamburger menu (☰) to open the sidebar
- Tap navigation items to navigate (menu closes automatically)
- Tap outside the sidebar or the X button to close

## 📊 API Endpoints

- `GET /api/dashboard` - Fetches dashboard data (agents, stats, system health)

## 🔧 Development

### Type Check

```bash
npx tsc --noEmit
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 📖 Documentation

- [Sidebar Implementation Details](./SIDEBAR_IMPLEMENTATION.md)
- [Quick Reference Guide](./SIDEBAR_QUICKREF.md)

## 🚀 Deployment

Build the production version:

```bash
npm run build
npm start
```

## 📝 Notes

- Dashboard data refreshes every 5 seconds automatically
- All timestamps are displayed in local time
- System health metrics are pulled from the OpenClaw gateway

## 🎯 Roadmap

- [ ] Session history and filtering
- [ ] Model configuration management
- [ ] User preferences and theming
- [ ] Cost tracking and alerts
- [ ] Agent performance analytics
