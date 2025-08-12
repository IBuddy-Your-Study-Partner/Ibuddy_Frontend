# Ibuddy_Frontend

A comprehensive productivity and wellness platform designed specifically for IB (International Baccalaureate) students, featuring the innovative Arena Mode for immersive study sessions. If you love higher grades, you will love this app.

# 🎯 Project Overview

Task management, mental wellness, and AI-driven scheduling into a gamified productivity experience.

# ✨ Key Features

### Core Functionality
- Smart To-Do List: AI-powered task prioritization by deadlines and difficulty
- IB Subject Study Planner: Pre-made templates for all 6 subjects + TOK + EE + IA
- Arena Mode: Full-screen productivity sessions with Pomodoro timers
- Stress Management: Daily check-ins, breathing exercises, binaural beats
- Buddy Finder: Match with students studying similar subjects
- Collaborative Forums: Peer support and resource sharing

### Arena Mode Features

- AI-generated daily schedules based on deadlines and productivity patterns
- Pomodoro-style intervals (25/50 min focus, 5/10 min breaks)
- Mindfulness intermissions every 3-4 tasks
- Real-time progress tracking with visual feedback
- Post-session analytics and performance insights

# Route Overview

```
/dashboard           # Main pre-arena interface
/arena              # Full-screen Arena Mode
/arena/session/:id  # Active study session
/aftermath          # Post-session analysis
/buddy-finder       # Student matching
/forums             # Collaborative discussions
/profile            # User settings and progress
/stress-tools       # Breathing exercises, binaural beats
```

# Repo Structure (Subject to change)

```
ibuddy/
├── app/
│   ├── globals.css
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard (home page)
│   ├── loading.tsx             # Global loading component
│   ├── arena/
│   │   ├── layout.tsx          # Arena-specific layout
│   │   └── page.tsx            # Arena Mode
│   └── aftermath/
│       └── page.tsx            # Aftermath Screen
├── components/
│   ├── Dashboard/
│   │   ├── CalendarWidget.tsx
│   │   ├── TaskInput.tsx
│   │   ├── TaskList.tsx
│   │   ├── SubjectProgress.tsx
│   │   ├── WellnessCheck.tsx
│   │   └── ArenaButton.tsx
│   ├── Arena/
│   │   ├── ArenaTimer.tsx
│   │   ├── TaskProgress.tsx
│   │   ├── BreathingRing.tsx
│   │   ├── TaskDisplay.tsx
│   │   └── ArenaControls.tsx
│   ├── Aftermath/
│   │   ├── PerformanceChart.tsx
│   │   ├── SessionSummary.tsx
│   │   ├── Achievements.tsx
│   │   └── Recommendations.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Header.tsx
├── hooks/
│   ├── useTimer.ts
│   ├── useLocalStorage.ts
│   ├── useBreathing.ts
│   └── useArenaSession.ts
├── context/
│   └── ArenaContext.tsx
├── types/
│   ├── index.ts
│   ├── tasks.ts
│   ├── session.ts
│   └── user.ts
├── utils/
│   ├── taskManager.ts
│   ├── timeFormatter.ts
│   └── analytics.ts
├── public/
│   ├── icons/
│   └── sounds/
├── next.config.js
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```
