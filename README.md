⭐ Flash Feedback Verse

A Multi-Sector Smart Review & Insights Platform

Flash Feedback Verse allows users to submit structured feedback on Movies, Series, Sports, Apps, and more — converting crowd reviews into meaningful insights.

🚀 Features

🎬 Review Multiple Content Types

⭐ Aspect-Based Rating Sliders

📊 Visual Summary & Analytics (upcoming)

🔐 Supabase Integration for Auth (optional)

⚡ Fast with Vite + TypeScript + React

🎨 Modern UI using Tailwind CSS + shadcn-ui Components

🏗️ Tech Stack
Layer	Technology
Frontend	React (TypeScript)
Styling	Tailwind CSS + shadcn-ui
State Mgmt	Custom hooks + React state
Backend (Optional)	Supabase
Build tool	Vite
📂 Project Folder Structure

(From your screenshot)

flash-feedback-verse/
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── CategoryCard.tsx
│   │   ├── LoginDialog.tsx
│   │   ├── MovieSuggestions.tsx
│   │   ├── Navigation.tsx
│   │   ├── SportsSelector.tsx
│   │   ├── TrendingContents.tsx
│   │   └── TrendingSection.tsx
│   │
│   ├── data/
│   │   └── sportsCategories.ts
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       └── clients.ts
│   │
│   ├── lib/
│   │   ├── storage.ts
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── App.tsx
│   │   └── index.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env (create manually)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

🔧 Installation & Running Locally
📌 Prerequisites

Make sure you have installed:

Node.js (version 18+ recommended)

npm / bun / pnpm (any one package manager)

▶️ Steps to Run
# Clone the repository
git clone https://github.com/pavan-nomula/flash-feedback-verse.git

# Go inside project
cd flash-feedback-verse

# Install dependencies
npm install    # or bun install

# Start development server
npm run dev

# Now open the local URL shown in terminal

🔑 Environment Variables

Create .env in project root (if Supabase is used):

VITE_SUPABASE_PROJECT_ID=""
VITE_SUPABASE_PUBLISHABLE_KEY=""
VITE_SUPABASE_URL=""


If Supabase is not configured yet, you can comment/remove related calls temporarily.

📦 Production Build
npm run build


To preview:

npm run preview

🔮 Future Enhancements

✔ Full CRUD for content items
✔ Leaderboards + Trending Analytics
✔ AI-generated summary reviews
✔ Social & sharing features
✔ Push to cloud database with moderation

🤝 Contributing

Pull requests are welcome!
Fork → Commit → PR 🚀

🧑‍💻 Author

Nomula Pavan Durga Sai Charan
Full-Stack Engineer & UI Enthusiast

⭐ Support

If you liked this project, please ⭐ the repo here:
👉 https://github.com/pavan-nomula/flash-feedback-verse