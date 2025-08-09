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
src/
├── components/
│   ├── Arena/
│   │   ├── ArenaMode.jsx              # Main Arena Mode container
│   │   ├── TaskProgressBar.jsx        # Floating numbered circles progress
│   │   ├── PomodoroTimer.jsx         # Focus/break timer with animations
│   │   ├── BreathingOverlay.jsx      # Breathing exercise overlay
│   │   └── MindfulnessSession.jsx    # Meditation/stress relief sessions
│   ├── Dashboard/
│   │   ├── PreArenaSetup.jsx         # Main dashboard before Arena
│   │   ├── SmartTodoList.jsx         # AI-powered task management
│   │   ├── IBStudyPlanner.jsx        # Subject-specific study templates
│   │   └── StressCheckin.jsx         # Daily mood/stress assessment
│   ├── PostSession/
│   │   ├── AftermathScreen.jsx       # Post-Arena analytics
│   │   ├── PerformanceChart.jsx      # Mood vs task performance
│   │   └── GamificationDisplay.jsx   # Streaks, coins, achievements
│   ├── Shared/
│   │   ├── BuddyFinder.jsx           # Student matching system
│   │   ├── CollaborativeForums.jsx   # Community discussions
│   │   └── StressManagementTools.jsx # Breathing exercises, music
│   └── Common/
│       ├── Navigation.jsx            # App navigation
│       ├── Timer.jsx                 # Reusable timer component
│       └── ProgressIndicator.jsx     # Progress visualization
├── pages/
│   ├── Dashboard.jsx                 # Pre-Arena main interface
│   ├── Arena.jsx                     # Full-screen Arena Mode
│   ├── Aftermath.jsx                 # Post-session analysis
│   ├── BuddyFinder.jsx              # Student matching
│   ├── Forums.jsx                    # Community discussions
│   └── Profile.jsx                   # User settings and progress
├── hooks/
│   ├── useTimer.js                   # Timer state management
│   ├── useArenaSession.js           # Arena session logic
│   └── useStressTracking.js         # Mood/stress data handling
├── utils/
│   ├── aiScheduler.js               # Task prioritization logic
│   ├── analytics.js                 # Performance tracking
│   └── gamification.js             # Streak/coin calculations
└── styles/
    ├── arena.css                    # Arena Mode specific styles
    ├── dashboard.css                # Dashboard styling
    └── animations.css               # Breathing animations, transitions
```
