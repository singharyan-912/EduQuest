# EduQuest - Project Structure

## Overview
EduQuest is a gamified learning platform for Class 10 and Class 12 students based on the NCERT syllabus. Students can earn XP, level up, track their progress, and compete on leaderboards.

## Tech Stack
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL with Authentication and Row Level Security)
- **Build Tool**: Vite

## Folder Structure

```
project/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── Navbar.tsx       # Main navigation bar
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   │
│   ├── lib/                 # Library files
│   │   └── supabase.ts      # Supabase client and types
│   │
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── Signup.tsx       # Signup page (includes class selection)
│   │   ├── Dashboard.tsx    # Dashboard with subject cards
│   │   ├── SubjectPage.tsx  # Chapters list for a subject
│   │   ├── ChapterPage.tsx  # Chapter details and actions
│   │   ├── Leaderboard.tsx  # Top users by XP
│   │   └── Progress.tsx     # User progress tracking
│   │
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
│
├── supabase/
│   └── migrations/          # Database migrations
│
├── .env                     # Environment variables
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Database Schema

### Tables

1. **profiles**
   - User profile extending Supabase auth
   - Fields: id, full_name, class, xp, level

2. **subjects**
   - Available subjects for each class
   - Fields: id, name, class, icon, description
   - Preloaded with: Physics, Chemistry, Biology, Mathematics

3. **chapters**
   - Chapters for each subject
   - Fields: id, subject_id, name, description, order_num, topics

4. **user_subject_progress**
   - Progress tracking per subject
   - Fields: user_id, subject_id, chapters_completed, progress_percentage

5. **user_chapter_progress**
   - Progress tracking per chapter
   - Fields: user_id, chapter_id, completed, xp_earned

## Key Features

### Authentication
- Email/password signup and login
- Class selection during signup (Class 10 or 12)
- Session management with Supabase Auth

### Dashboard
- User stats display (Level, XP, Class)
- Subject cards filtered by user's class
- Quick navigation to all sections

### Learning Flow
1. Select a subject from dashboard
2. View chapters with topics
3. Start learning or challenges (placeholders)
4. Mark chapters as complete to earn XP

### Gamification
- Earn 50 XP per completed chapter
- Level up every 100 XP
- Compete on global leaderboard
- Track progress across all subjects

### Pages
- **Home**: Welcome page with feature highlights
- **Signup/Login**: Authentication flows
- **Dashboard**: Subject overview and user stats
- **Subject Page**: List of chapters for a subject
- **Chapter Page**: Topics and completion actions
- **Leaderboard**: Top users ranked by XP
- **Progress**: Subject-wise completion tracking

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Leaderboard and subjects are publicly readable
- Authentication required for all learning features

## Future Enhancements
- Interactive learning modules
- Quiz/challenge system
- Achievement badges
- Study streaks
- Subject-specific leaderboards
- Detailed chapter content
