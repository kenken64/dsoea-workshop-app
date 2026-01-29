# S-DOEA Workshop Tutorial App

A GitBook-style workshop tutorial application for DevSecOps Engineering and Automation (S-DOEA) courses. Built with Next.js 14, SQLite, and Tailwind CSS.

## Features

- **Workshop Content Management**: Organize content into chapters and pages with markdown support
- **Video Integration**: YouTube video embedding with progress saving and resume functionality
- **Tutorial Tab**: Markdown rendering with syntax highlighting and copy-to-clipboard for code blocks
- **Submission Tab**: Workshop submission guidelines with screenshots and instructions
- **AI Debrief**: OpenAI-powered workshop summaries explaining commands and code (cached in database)
- **Responsive Sidebar**: Collapsible navigation with mobile support
- **Search**: Full-text search across all workshop content
- **Dark/Light Mode**: Automatic theme based on system preference

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI API (GPT-4o-mini)
- **Markdown**: react-markdown with rehype-highlight

## Workshops Included

| Chapter | Workshops |
|---------|-----------|
| Source Control Management | Workshop 1, Workshop 2 |
| Containerization & Security | Workshop 3, Workshop 8 |
| Infrastructure as Code | Workshop 4, Workshop 5 |
| GitHub Actions - CICD | Workshop 6, Workshop 7 |
| Unit Testing | JUnit Workshop |
| Load Testing | JMeter Workshop |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kenken64/dsoea-workshop-app.git
cd dsoea-workshop-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
DATABASE_URL=file:workshop.db
OPENAI_API_KEY=your_openai_api_key_here
```

5. Seed the database:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sdoea-workshop/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── ai-summary/    # OpenAI summary endpoint
│   │   └── search/        # Search endpoint
│   ├── [chapterSlug]/     # Dynamic chapter routes
│   │   └── [pageSlug]/    # Dynamic page routes
│   └── layout.tsx         # Root layout with sidebar
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── workshop-tabs.tsx # Video/Tutorial/Submission/AI tabs
│   ├── youtube-player.tsx # YouTube embed with progress
│   ├── ai-debrief.tsx    # AI summary component
│   └── markdown-renderer.tsx # Markdown with code copy
├── content/              # Markdown workshop content
│   └── [chapter-slug]/
│       ├── _index.md     # Chapter metadata
│       └── [page].md     # Workshop content
├── db/                   # Database
│   ├── schema.ts        # Drizzle schema
│   ├── seed.ts          # Seed script
│   └── index.ts         # Database connection
├── lib/                  # Utilities
│   └── content.ts       # Content loading
└── public/              # Static assets
    └── docs/            # Downloadable documents
```

## Adding Workshop Content

1. Create a chapter folder in `content/`:
```
content/07-new-chapter/
├── _index.md
└── 01-workshop.md
```

2. Add chapter metadata in `_index.md`:
```yaml
---
title: "New Chapter"
order: 7
---
```

3. Add workshop content in `01-workshop.md`:
```yaml
---
title: "Workshop Title"
order: 1
videoUrl: "https://youtu.be/VIDEO_ID"
submission: |
  # Submission Instructions
  Upload screenshots to Canvas...
---

# Workshop Content

Your markdown content here...
```

4. Re-run the seed script:
```bash
npm run db:seed
```

## Deployment to Railway

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Railway will auto-detect the Dockerfile

### 3. Add Volume (for persistent database)

1. Go to your service → **Volumes**
2. Add new volume
3. Set mount path: `/app/data`

### 4. Set Environment Variables

```
DATABASE_URL=file:/app/data/workshop.db
OPENAI_API_KEY=your_openai_api_key
```

### 5. Deploy

Railway will automatically build and deploy. The database is seeded on each container start.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed database from markdown files |
| `npm run db:reset` | Reset database |
| `npm run db:studio` | Open Drizzle Studio |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path (e.g., `file:workshop.db`) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI Debrief feature | Yes |

## License

MIT

## Author

Created for NUS-ISS DevSecOps Engineering and Automation course.
