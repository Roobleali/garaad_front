# Garaad

**Garaad** is a platform designed to empower Somalis with accessible, high-quality educational resources and community tools.

---

## What is Garaad?

Garaad is an **educational platform** (think Duolingo meets Product Hunt for the Somali-speaking world) with five main pillars: a learning management system, a community, a blog, a startup directory, and payments.

---

## The Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 + React 19, deployed on Vercel. The browser talks directly to the Django API over HTTPS. Zustand manages state, TipTap handles rich content, Stripe and Waafi handle payments. |
| **Backend** | Django with REST Framework, running as an ASGI app (Daphne) with real-time support via Django Channels + Redis. |
| **Video storage** | A separate FastAPI microservice uses **Telegram as a free CDN** to store and stream course videos, avoiding the cost of S3 or similar. Django delegates all video handling to this bridge. |

---

## The Five Modules

- **LMS** — Courses organized into categories, broken into lessons with rich content blocks (video, code, text, quizzes). Students enroll, track progress, earn streaks, compete on leaderboards, and burn "energy" — full gamification loop.
- **Community** — A campus-based forum with posts, replies, reactions, push notifications, and a public preview for non-logged-in users.
- **Blog** — Standard CMS blog with tags, slugs, and full OG/social meta for sharing.
- **Launchpad** — A Product Hunt–style startup directory where anyone can submit a startup, get votes, and collect comments.
- **Payments** — Stripe for international, Waafi for local (Somali market). Orders, receipts, subscriptions all covered.

---

## Admin

A fully custom admin panel (separate from Django admin) with its own auth, covering:

- Blog CRUD
- Course and lesson management
- Media and questions
- User marketing campaigns
- Dashboard with revenue/activity overview

Some admin routes use Somali labels: *casharada* = lessons, *koorsooyinka* = courses, *qaybaha* = categories.

---

## Why Garaad?

Garaad connects students, professionals, and lifelong learners with:

- **Localized content** — Educational materials tailored for the Somali context.
- **Community interaction** — Forums and discussion boards to share knowledge.
- **Seamless payments** — Integration with local payment methods like WaafiPay.

---

## The Solo Dev Angle

This is built to be run by one person: scripts for one-off operations, a Telegram video bridge to avoid infrastructure costs, Zustand over Redux for simplicity, and a tight monorepo-style split between frontend and backend.

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Quick start

1. **Clone and setup**
   ```bash
   git clone https://github.com/StartUp-Somalia/garaad.git
   cd garaad
   npm run setup
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual setup

1. `npm install`
2. `cp .env.example .env.local` (and update credentials)
3. `npm run dev`

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment.
