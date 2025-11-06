import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Task, Achievement, Milestone, CareerStats } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { taskService } from '../services/taskService';
import { achievementService } from '../services/achievementService';
import { codingService } from '../services/codingService';

interface Notification {
  id: string;
  type: 'achievement' | 'level-up' | 'task-completed' | 'streak' | 'challenge' | 'badge' | 'reward' | 'social' | 'mission';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic';
  category: string;
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  timeLimit: number; // in hours
  completed: boolean;
  expiresAt: Date;
  multiplier?: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SideQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  tags: string[];
  completed: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain';
  level: number;
  maxLevel: number;
  xp: number;
  xpRequired: number;
  unlocked: boolean;
  prerequisites: string[];
  description: string;
  benefits: string[];
  practiceActivities: PracticeActivity[];
}

interface PracticeActivity {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  timeEstimate: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'tutorial' | 'project' | 'exercise' | 'challenge';
  completed: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  xpReward: number;
  timeLimit: string;
  progress: number;
  maxProgress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  category: string;
  requirements: string[];
  rewards: string[];
  startedAt?: Date;
  completedAt?: Date;
  milestones: ChallengeMilestone[];
}

interface ChallengeMilestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  xpReward: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'short-term' | 'long-term' | 'career';
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  xpReward: number;
  milestones: GoalMilestone[];
  tags: string[];
  estimatedHours: number;
  actualHours: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  xpReward: number;
  dueDate: Date;
}

interface AppState {
  user: User | null;
  tasks: Task[];
  codingStats: CodingStats;
  githubStats: GitHubStats | null;
  platformStats: PlatformStats | null;
  performanceMetrics: PerformanceMetrics | null;
  integrationStatus: IntegrationStatus;
  notifications: Notification[];
  achievements: Achievement[];
  milestones: Milestone[];
  careerStats: CareerStats;
  badges: Badge[];
  dailyMissions: DailyMission[];
  sideQuests: SideQuest[];
  skills: Skill[];
  challenges: Challenge[];
  goals: Goal[];
  codingStats: {
    totalSolved: number;
    currentStreak: number;
    longestStreak: number;
    todaysSolved: number;
    weeklyTarget: number;
    weeklyProgress: number;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    platformStats: {
      leetcode: number;
      geeksforgeeks: number;
      codechef: number;
    };
    topicStats: {
      [key: string]: number;
    };
  };
  xpSystem: {
    currentXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    totalXPEarned: number;
    xpMultiplier: number;
    bonusXPActive: boolean;
    bonusXPExpiry?: Date;
  };
  socialStats: {
    followers: number;
    following: number;
    profileViews: number;
    applauds: number;
    rank: number;
    totalUsers: number;
  };
  darkMode: boolean;
  isSetupComplete: boolean;
  loading: boolean;
  notifications: Notification[];
  showLevelUpAnimation: boolean;
  showBadgeUnlock: boolean;
  showConfetti: boolean;
  recentRewards: string[];
  activeTheme: string;
  unlockedThemes: string[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_MILESTONE'; payload: Milestone }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_STATS'; payload: Partial<CareerStats> }
  | { type: 'SET_CAREER_STATS'; payload: CareerStats }
  | { type: 'UPDATE_CODING_STATS'; payload: any }
  | { type: 'SET_BADGES'; payload: Badge[] }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'SET_DAILY_MISSIONS'; payload: DailyMission[] }
  | { type: 'COMPLETE_MISSION'; payload: string }
  | { type: 'SET_SIDE_QUESTS'; payload: SideQuest[] }
  | { type: 'COMPLETE_SIDE_QUEST'; payload: string }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'PRACTICE_SKILL'; payload: { skillId: string; activityId: string } }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'UPDATE_CHALLENGE'; payload: Challenge }
  | { type: 'START_CHALLENGE'; payload: string }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'UPDATE_CODING_STATS'; payload: Partial<CodingStats> }
  | { type: 'UPDATE_GITHUB_STATS'; payload: GitHubStats }
  | { type: 'UPDATE_PLATFORM_STATS'; payload: Partial<PlatformStats> }
  | { type: 'UPDATE_PERFORMANCE_METRICS'; payload: PerformanceMetrics }
  | { type: 'UPDATE_INTEGRATION_STATUS'; payload: Partial<IntegrationStatus> }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'COMPLETE_SETUP' }
  | { type: 'ADD_XP'; payload: { amount: number; source: string; multiplier?: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LEVEL_UP'; payload: { newLevel: number; xpGained: number } }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SOLVE_PROBLEM'; payload: { xp: number; difficulty: string; platform: string; topic: string } }
  | { type: 'SHOW_LEVEL_UP_ANIMATION'; payload: boolean }
  | { type: 'SHOW_BADGE_UNLOCK'; payload: boolean }
  | { type: 'SHOW_CONFETTI'; payload: boolean }
  | { type: 'ADD_REWARD'; payload: string }
  | { type: 'UPDATE_SOCIAL_STATS'; payload: Partial<AppState['socialStats']> }
  | { type: 'ACTIVATE_BONUS_XP'; payload: { multiplier: number; duration: number } }
  | { type: 'CHANGE_THEME'; payload: string }
  | { type: 'UNLOCK_THEME'; payload: string };

// Dynamic XP calculation functions
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

const calculateLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;
  while (totalXP <= xp) {
    totalXP += calculateXPForLevel(level);
    if (totalXP > xp) break;
    level++;
  }
  return level;
};

const calculateXPToNextLevel = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = calculateXPForLevel(currentLevel);
  const xpEarnedInCurrentLevel = currentXP % xpForCurrentLevel;
  return xpForCurrentLevel - xpEarnedInCurrentLevel;
};

// Dynamic badge system
const generateBadges = (): Badge[] => {
  const badgeCategories = [
    { category: 'XP Milestones', icon: '⚡', rarity: 'bronze' as const },
    { category: 'Coding', icon: '💻', rarity: 'silver' as const },
    { category: 'Streaks', icon: '🔥', rarity: 'gold' as const },
    { category: 'Social', icon: '👥', rarity: 'platinum' as const },
    { category: 'Special', icon: '🌟', rarity: 'mythic' as const },
  ];

  const badges: Badge[] = [];
  
  // XP Milestone badges
  [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].forEach((xp, index) => {
    badges.push({
      id: `xp-${xp}`,
      name: `${xp} XP Master`,
      description: `Earned ${xp.toLocaleString()} total XP`,
      icon: '⚡',
      xpRequired: xp,
      unlocked: false,
      rarity: index < 2 ? 'bronze' : index < 4 ? 'silver' : index < 6 ? 'gold' : 'platinum',
      category: 'XP Milestones'
    });
  });

  // Coding badges
  [10, 25, 50, 100, 250, 500, 1000].forEach((count, index) => {
    badges.push({
      id: `coding-${count}`,
      name: `${count} Problems Solved`,
      description: `Solved ${count} coding problems`,
      icon: '💻',
      xpRequired: count * 50,
      unlocked: false,
      rarity: index < 2 ? 'bronze' : index < 4 ? 'silver' : index < 6 ? 'gold' : 'platinum',
      category: 'Coding'
    });
  });

  // Streak badges
  [7, 14, 30, 60, 100, 365].forEach((days, index) => {
    badges.push({
      id: `streak-${days}`,
      name: `${days} Day Streak`,
      description: `Maintained a ${days} day streak`,
      icon: '🔥',
      xpRequired: days * 10,
      unlocked: false,
      rarity: index < 2 ? 'bronze' : index < 3 ? 'silver' : index < 5 ? 'gold' : 'platinum',
      category: 'Streaks'
    });
  });

  return badges;
};

// Dynamic daily missions generator
const generateDailyMissions = (): DailyMission[] => {
  const missionTemplates = [
    { title: 'Code Warrior', description: 'Solve 3 coding problems', xpReward: 150, category: 'coding', difficulty: 'medium' as const },
    { title: 'Task Master', description: 'Complete 5 tasks', xpReward: 100, category: 'productivity', difficulty: 'easy' as const },
    { title: 'Learning Sprint', description: 'Study for 2 hours', xpReward: 200, category: 'learning', difficulty: 'hard' as const },
    { title: 'Social Butterfly', description: 'Connect with 3 professionals', xpReward: 75, category: 'networking', difficulty: 'easy' as const },
    { title: 'Skill Builder', description: 'Practice a skill for 1 hour', xpReward: 125, category: 'skills', difficulty: 'medium' as const },
    { title: 'Goal Crusher', description: 'Make progress on 2 goals', xpReward: 175, category: 'goals', difficulty: 'medium' as const },
    { title: 'Challenge Accepted', description: 'Start a new challenge', xpReward: 250, category: 'challenges', difficulty: 'hard' as const },
    { title: 'Knowledge Seeker', description: 'Read 3 tech articles', xpReward: 90, category: 'learning', difficulty: 'easy' as const },
    { title: 'Project Pioneer', description: 'Work on portfolio project', xpReward: 300, category: 'portfolio', difficulty: 'hard' as const },
    { title: 'Interview Prep', description: 'Practice 10 interview questions', xpReward: 180, category: 'interview', difficulty: 'medium' as const },
  ];

  const today = new Date();
  const missions: DailyMission[] = [];

  // Generate 3 random missions for today
  const shuffled = [...missionTemplates].sort(() => 0.5 - Math.random());
  for (let i = 0; i < 3; i++) {
    const template = shuffled[i];
    const expiresAt = new Date(today);
    expiresAt.setHours(23, 59, 59, 999);

    missions.push({
      id: `mission-${today.getTime()}-${i}`,
      ...template,
      timeLimit: Math.random() > 0.5 ? 4 : 8, // 4 or 8 hours
      completed: false,
      expiresAt,
      multiplier: Math.random() > 0.7 ? 2 : 1, // 30% chance of double XP
    });
  }

  return missions;
};

// Dynamic side quests generator
const generateSideQuests = (): SideQuest[] => {
  const questTemplates = [
    { title: 'Debug Detective', description: 'Fix 5 bugs in your code', xpReward: 80, category: 'coding', difficulty: 'medium' as const, estimatedTime: 45, tags: ['debugging', 'problem-solving'] },
    { title: 'Documentation Dynamo', description: 'Write README for a project', xpReward: 60, category: 'documentation', difficulty: 'easy' as const, estimatedTime: 30, tags: ['writing', 'documentation'] },
    { title: 'Algorithm Ace', description: 'Implement a sorting algorithm', xpReward: 120, category: 'algorithms', difficulty: 'hard' as const, estimatedTime: 60, tags: ['algorithms', 'implementation'] },
    { title: 'UI/UX Explorer', description: 'Design a mobile app mockup', xpReward: 100, category: 'design', difficulty: 'medium' as const, estimatedTime: 90, tags: ['design', 'ui/ux'] },
    { title: 'API Architect', description: 'Build a REST API endpoint', xpReward: 150, category: 'backend', difficulty: 'hard' as const, estimatedTime: 120, tags: ['api', 'backend'] },
    { title: 'Test Titan', description: 'Write unit tests for a function', xpReward: 70, category: 'testing', difficulty: 'medium' as const, estimatedTime: 40, tags: ['testing', 'quality'] },
    { title: 'Performance Pro', description: 'Optimize code performance', xpReward: 130, category: 'optimization', difficulty: 'hard' as const, estimatedTime: 75, tags: ['performance', 'optimization'] },
    { title: 'Security Sentinel', description: 'Implement authentication', xpReward: 180, category: 'security', difficulty: 'hard' as const, estimatedTime: 100, tags: ['security', 'auth'] },
    { title: 'Database Designer', description: 'Design a database schema', xpReward: 110, category: 'database', difficulty: 'medium' as const, estimatedTime: 50, tags: ['database', 'design'] },
    { title: 'DevOps Dynamo', description: 'Set up CI/CD pipeline', xpReward: 200, category: 'devops', difficulty: 'hard' as const, estimatedTime: 150, tags: ['devops', 'automation'] },
    { title: 'Code Reviewer', description: 'Review 3 pull requests', xpReward: 90, category: 'collaboration', difficulty: 'medium' as const, estimatedTime: 60, tags: ['review', 'collaboration'] },
    { title: 'Tech Blogger', description: 'Write a technical blog post', xpReward: 140, category: 'writing', difficulty: 'medium' as const, estimatedTime: 120, tags: ['writing', 'sharing'] },
    { title: 'Open Source Hero', description: 'Contribute to open source', xpReward: 250, category: 'open-source', difficulty: 'hard' as const, estimatedTime: 180, tags: ['open-source', 'community'] },
    { title: 'Mentor Mode', description: 'Help a junior developer', xpReward: 160, category: 'mentoring', difficulty: 'medium' as const, estimatedTime: 90, tags: ['mentoring', 'teaching'] },
    { title: 'Conference Caller', description: 'Attend a tech conference', xpReward: 120, category: 'learning', difficulty: 'easy' as const, estimatedTime: 480, tags: ['learning', 'networking'] },
  ];

  return questTemplates.map((template, index) => ({
    id: `quest-${index}`,
    ...template,
    completed: false,
  }));
};

// Enhanced skills system
const generateSkills = (): Skill[] => {
  const skillsData = [
    // Technical Skills - Frontend
    {
      id: 'html-css',
      name: 'HTML & CSS',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 100,
      unlocked: true,
      prerequisites: [],
      description: 'Master the fundamentals of web development with HTML and CSS',
      benefits: ['Create responsive layouts', 'Style beautiful interfaces', 'Understand web standards'],
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 150,
      unlocked: false,
      prerequisites: ['html-css'],
      description: 'Learn the programming language of the web',
      benefits: ['Add interactivity to websites', 'Build dynamic applications', 'Understand modern JS features'],
    },
    {
      id: 'react',
      name: 'React',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 200,
      unlocked: false,
      prerequisites: ['javascript'],
      description: 'Build modern user interfaces with React',
      benefits: ['Component-based architecture', 'State management', 'Modern development patterns'],
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 180,
      unlocked: false,
      prerequisites: ['javascript'],
      description: 'Add type safety to JavaScript applications',
      benefits: ['Better code quality', 'Enhanced IDE support', 'Catch errors early'],
    },
    {
      id: 'vue',
      name: 'Vue.js',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 190,
      unlocked: false,
      prerequisites: ['javascript'],
      description: 'Progressive framework for building user interfaces',
      benefits: ['Easy learning curve', 'Flexible architecture', 'Great documentation'],
    },
    {
      id: 'angular',
      name: 'Angular',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 220,
      unlocked: false,
      prerequisites: ['typescript'],
      description: 'Full-featured framework for enterprise applications',
      benefits: ['Complete solution', 'Enterprise-ready', 'Strong typing'],
    },

    // Technical Skills - Backend
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 170,
      unlocked: false,
      prerequisites: ['javascript'],
      description: 'Server-side JavaScript runtime',
      benefits: ['Full-stack JavaScript', 'NPM ecosystem', 'Scalable applications'],
    },
    {
      id: 'python',
      name: 'Python',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 160,
      unlocked: true,
      prerequisites: [],
      description: 'Versatile programming language for various applications',
      benefits: ['Easy to learn', 'Versatile applications', 'Large community'],
    },
    {
      id: 'django',
      name: 'Django',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 200,
      unlocked: false,
      prerequisites: ['python'],
      description: 'High-level Python web framework',
      benefits: ['Rapid development', 'Built-in admin', 'Security features'],
    },
    {
      id: 'flask',
      name: 'Flask',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 180,
      unlocked: false,
      prerequisites: ['python'],
      description: 'Lightweight Python web framework',
      benefits: ['Minimalist approach', 'Flexible architecture', 'Easy to learn'],
    },
    {
      id: 'java',
      name: 'Java',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 190,
      unlocked: true,
      prerequisites: [],
      description: 'Enterprise-grade programming language',
      benefits: ['Platform independent', 'Strong typing', 'Enterprise applications'],
    },
    {
      id: 'spring',
      name: 'Spring Framework',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 220,
      unlocked: false,
      prerequisites: ['java'],
      description: 'Comprehensive framework for Java applications',
      benefits: ['Dependency injection', 'Enterprise features', 'Microservices'],
    },

    // Technical Skills - Database
    {
      id: 'sql',
      name: 'SQL',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 140,
      unlocked: true,
      prerequisites: [],
      description: 'Structured Query Language for databases',
      benefits: ['Data manipulation', 'Database design', 'Query optimization'],
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 160,
      unlocked: false,
      prerequisites: ['sql'],
      description: 'NoSQL document database',
      benefits: ['Flexible schema', 'Horizontal scaling', 'JSON-like documents'],
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 170,
      unlocked: false,
      prerequisites: ['sql'],
      description: 'Advanced open-source relational database',
      benefits: ['ACID compliance', 'Advanced features', 'Extensible'],
    },

    // Technical Skills - DevOps
    {
      id: 'git',
      name: 'Git',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 120,
      unlocked: true,
      prerequisites: [],
      description: 'Version control system for tracking changes',
      benefits: ['Code versioning', 'Collaboration', 'Branching strategies'],
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 180,
      unlocked: false,
      prerequisites: ['git'],
      description: 'Containerization platform for applications',
      benefits: ['Environment consistency', 'Easy deployment', 'Microservices'],
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 250,
      unlocked: false,
      prerequisites: ['docker'],
      description: 'Container orchestration platform',
      benefits: ['Auto-scaling', 'Service discovery', 'Rolling updates'],
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 200,
      unlocked: false,
      prerequisites: ['docker'],
      description: 'Amazon Web Services cloud platform',
      benefits: ['Cloud computing', 'Scalable infrastructure', 'Global reach'],
    },

    // Soft Skills
    {
      id: 'communication',
      name: 'Communication',
      category: 'soft' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 100,
      unlocked: true,
      prerequisites: [],
      description: 'Effective verbal and written communication',
      benefits: ['Clear expression', 'Active listening', 'Presentation skills'],
    },
    {
      id: 'leadership',
      name: 'Leadership',
      category: 'soft' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 150,
      unlocked: false,
      prerequisites: ['communication'],
      description: 'Guide and inspire teams to achieve goals',
      benefits: ['Team management', 'Decision making', 'Motivation'],
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      category: 'soft' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 130,
      unlocked: true,
      prerequisites: [],
      description: 'Analytical thinking and solution finding',
      benefits: ['Critical thinking', 'Creative solutions', 'Debugging skills'],
    },
    {
      id: 'time-management',
      name: 'Time Management',
      category: 'soft' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 110,
      unlocked: true,
      prerequisites: [],
      description: 'Efficiently organize and prioritize tasks',
      benefits: ['Productivity', 'Work-life balance', 'Stress reduction'],
    },
    {
      id: 'teamwork',
      name: 'Teamwork',
      category: 'soft' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 120,
      unlocked: false,
      prerequisites: ['communication'],
      description: 'Collaborate effectively with others',
      benefits: ['Collaboration', 'Conflict resolution', 'Shared goals'],
    },

    // Domain Skills
    {
      id: 'web-development',
      name: 'Web Development',
      category: 'domain' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 300,
      unlocked: false,
      prerequisites: ['html-css', 'javascript'],
      description: 'Full-stack web application development',
      benefits: ['End-to-end development', 'Modern frameworks', 'Best practices'],
    },
    {
      id: 'mobile-development',
      name: 'Mobile Development',
      category: 'domain' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 280,
      unlocked: false,
      prerequisites: ['javascript'],
      description: 'Native and cross-platform mobile apps',
      benefits: ['iOS/Android apps', 'React Native', 'Flutter'],
    },
    {
      id: 'data-science',
      name: 'Data Science',
      category: 'domain' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 320,
      unlocked: false,
      prerequisites: ['python', 'sql'],
      description: 'Extract insights from data',
      benefits: ['Machine learning', 'Data visualization', 'Statistical analysis'],
    },
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      category: 'domain' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 350,
      unlocked: false,
      prerequisites: ['data-science'],
      description: 'Build intelligent systems',
      benefits: ['AI algorithms', 'Model training', 'Predictive analytics'],
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      category: 'domain' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 290,
      unlocked: false,
      prerequisites: ['networking'],
      description: 'Protect systems and data',
      benefits: ['Security protocols', 'Threat analysis', 'Risk management'],
    },
    {
      id: 'networking',
      name: 'Networking',
      category: 'technical' as const,
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpRequired: 160,
      unlocked: true,
      prerequisites: [],
      description: 'Computer networks and protocols',
      benefits: ['Network design', 'Protocol understanding', 'Troubleshooting'],
    },
  ];

  return skillsData.map(skill => ({
    ...skill,
    practiceActivities: generatePracticeActivities(skill.id),
  }));
};

// Generate practice activities for each skill
const generatePracticeActivities = (skillId: string): PracticeActivity[] => {
  const activityTemplates: { [key: string]: PracticeActivity[] } = {
    'html-css': [
      { id: 'html-1', title: 'Build a Personal Portfolio', description: 'Create a responsive portfolio website', xpReward: 50, timeEstimate: 120, difficulty: 'beginner', type: 'project', completed: false },
      { id: 'html-2', title: 'CSS Grid Layout', description: 'Master CSS Grid with practical exercises', xpReward: 30, timeEstimate: 60, difficulty: 'intermediate', type: 'tutorial', completed: false },
      { id: 'html-3', title: 'Flexbox Challenge', description: 'Complete flexbox layout challenges', xpReward: 25, timeEstimate: 45, difficulty: 'beginner', type: 'exercise', completed: false },
      { id: 'html-4', title: 'Responsive Design', description: 'Build mobile-first responsive layouts', xpReward: 40, timeEstimate: 90, difficulty: 'intermediate', type: 'project', completed: false },
    ],
    'javascript': [
      { id: 'js-1', title: 'DOM Manipulation', description: 'Interactive web page with vanilla JS', xpReward: 45, timeEstimate: 75, difficulty: 'beginner', type: 'project', completed: false },
      { id: 'js-2', title: 'Async Programming', description: 'Master Promises and async/await', xpReward: 60, timeEstimate: 90, difficulty: 'intermediate', type: 'tutorial', completed: false },
      { id: 'js-3', title: 'ES6+ Features', description: 'Modern JavaScript features practice', xpReward: 35, timeEstimate: 60, difficulty: 'intermediate', type: 'exercise', completed: false },
      { id: 'js-4', title: 'API Integration', description: 'Fetch data from REST APIs', xpReward: 55, timeEstimate: 100, difficulty: 'intermediate', type: 'project', completed: false },
    ],
    'react': [
      { id: 'react-1', title: 'Todo App', description: 'Build a React todo application', xpReward: 70, timeEstimate: 120, difficulty: 'beginner', type: 'project', completed: false },
      { id: 'react-2', title: 'State Management', description: 'Learn useState and useEffect hooks', xpReward: 50, timeEstimate: 80, difficulty: 'beginner', type: 'tutorial', completed: false },
      { id: 'react-3', title: 'Component Patterns', description: 'Advanced React patterns and practices', xpReward: 80, timeEstimate: 150, difficulty: 'advanced', type: 'tutorial', completed: false },
      { id: 'react-4', title: 'E-commerce App', description: 'Full-featured shopping cart application', xpReward: 120, timeEstimate: 300, difficulty: 'advanced', type: 'project', completed: false },
    ],
    'python': [
      { id: 'python-1', title: 'Data Analysis', description: 'Analyze datasets with pandas', xpReward: 60, timeEstimate: 100, difficulty: 'intermediate', type: 'project', completed: false },
      { id: 'python-2', title: 'Web Scraping', description: 'Extract data from websites', xpReward: 55, timeEstimate: 90, difficulty: 'intermediate', type: 'project', completed: false },
      { id: 'python-3', title: 'Algorithm Implementation', description: 'Implement common algorithms', xpReward: 45, timeEstimate: 75, difficulty: 'intermediate', type: 'exercise', completed: false },
      { id: 'python-4', title: 'REST API', description: 'Build a REST API with Flask', xpReward: 80, timeEstimate: 150, difficulty: 'advanced', type: 'project', completed: false },
    ],
  };

  return activityTemplates[skillId] || [
    { id: `${skillId}-1`, title: 'Basic Practice', description: 'Fundamental exercises', xpReward: 30, timeEstimate: 60, difficulty: 'beginner', type: 'exercise', completed: false },
    { id: `${skillId}-2`, title: 'Intermediate Project', description: 'Build a practical project', xpReward: 60, timeEstimate: 120, difficulty: 'intermediate', type: 'project', completed: false },
    { id: `${skillId}-3`, title: 'Advanced Challenge', description: 'Complex problem solving', xpReward: 90, timeEstimate: 180, difficulty: 'advanced', type: 'challenge', completed: false },
  ];
};

// Enhanced challenges system
const generateChallenges = (): Challenge[] => {
  return [
    {
      id: 'dsa-sprint',
      title: 'DSA Sprint Challenge',
      description: 'Master data structures and algorithms by solving problems across different difficulty levels',
      difficulty: 'Medium',
      xpReward: 500,
      timeLimit: '7 days',
      progress: 0,
      maxProgress: 25,
      status: 'not-started',
      category: 'Programming',
      requirements: ['Basic programming knowledge', 'Problem-solving skills'],
      rewards: ['DSA Master badge', '500 XP', 'Algorithm expertise'],
      milestones: [
        { id: 'dsa-1', title: 'Array Basics', description: 'Solve 5 array problems', progress: 0, target: 5, completed: false, xpReward: 100 },
        { id: 'dsa-2', title: 'String Manipulation', description: 'Solve 5 string problems', progress: 0, target: 5, completed: false, xpReward: 100 },
        { id: 'dsa-3', title: 'Tree Traversal', description: 'Solve 5 tree problems', progress: 0, target: 5, completed: false, xpReward: 150 },
        { id: 'dsa-4', title: 'Dynamic Programming', description: 'Solve 5 DP problems', progress: 0, target: 5, completed: false, xpReward: 200 },
        { id: 'dsa-5', title: 'Graph Algorithms', description: 'Solve 5 graph problems', progress: 0, target: 5, completed: false, xpReward: 250 },
      ],
    },
    {
      id: 'portfolio-boost',
      title: 'Portfolio Powerhouse',
      description: 'Build an impressive portfolio with multiple projects showcasing different technologies',
      difficulty: 'Hard',
      xpReward: 750,
      timeLimit: '14 days',
      progress: 0,
      maxProgress: 5,
      status: 'not-started',
      category: 'Portfolio',
      requirements: ['Web development skills', 'Design sense', 'Project planning'],
      rewards: ['Portfolio Master badge', '750 XP', 'Professional portfolio'],
      milestones: [
        { id: 'port-1', title: 'Frontend Project', description: 'Build a React/Vue application', progress: 0, target: 1, completed: false, xpReward: 150 },
        { id: 'port-2', title: 'Backend API', description: 'Create a REST API', progress: 0, target: 1, completed: false, xpReward: 150 },
        { id: 'port-3', title: 'Full-Stack App', description: 'Complete full-stack application', progress: 0, target: 1, completed: false, xpReward: 200 },
        { id: 'port-4', title: 'Mobile App', description: 'Build a mobile application', progress: 0, target: 1, completed: false, xpReward: 175 },
        { id: 'port-5', title: 'Documentation', description: 'Write comprehensive documentation', progress: 0, target: 1, completed: false, xpReward: 75 },
      ],
    },
    {
      id: 'networking-ninja',
      title: 'Networking Ninja',
      description: 'Expand your professional network and build meaningful connections in the tech industry',
      difficulty: 'Easy',
      xpReward: 300,
      timeLimit: '10 days',
      progress: 0,
      maxProgress: 20,
      status: 'not-started',
      category: 'Networking',
      requirements: ['LinkedIn profile', 'Professional mindset', 'Communication skills'],
      rewards: ['Network Builder badge', '300 XP', 'Industry connections'],
      milestones: [
        { id: 'net-1', title: 'LinkedIn Optimization', description: 'Update and optimize LinkedIn profile', progress: 0, target: 1, completed: false, xpReward: 50 },
        { id: 'net-2', title: 'Connect with Professionals', description: 'Connect with 10 industry professionals', progress: 0, target: 10, completed: false, xpReward: 100 },
        { id: 'net-3', title: 'Engage with Content', description: 'Comment on 15 professional posts', progress: 0, target: 15, completed: false, xpReward: 75 },
        { id: 'net-4', title: 'Share Knowledge', description: 'Post 3 professional updates', progress: 0, target: 3, completed: false, xpReward: 75 },
      ],
    },
    {
      id: 'interview-master',
      title: 'Interview Mastery',
      description: 'Prepare comprehensively for technical and behavioral interviews',
      difficulty: 'Elite',
      xpReward: 1000,
      timeLimit: '21 days',
      progress: 0,
      maxProgress: 15,
      status: 'not-started',
      category: 'Interview Prep',
      requirements: ['Technical knowledge', 'Communication skills', 'Problem-solving ability'],
      rewards: ['Interview Expert badge', '1000 XP', 'Interview confidence'],
      milestones: [
        { id: 'int-1', title: 'Technical Questions', description: 'Practice 50 technical questions', progress: 0, target: 50, completed: false, xpReward: 200 },
        { id: 'int-2', title: 'Behavioral Questions', description: 'Prepare 20 behavioral responses', progress: 0, target: 20, completed: false, xpReward: 150 },
        { id: 'int-3', title: 'Mock Interviews', description: 'Complete 5 mock interviews', progress: 0, target: 5, completed: false, xpReward: 250 },
        { id: 'int-4', title: 'System Design', description: 'Study 10 system design problems', progress: 0, target: 10, completed: false, xpReward: 200 },
        { id: 'int-5', title: 'Company Research', description: 'Research 5 target companies', progress: 0, target: 5, completed: false, xpReward: 100 },
        { id: 'int-6', title: 'Salary Negotiation', description: 'Learn negotiation strategies', progress: 0, target: 1, completed: false, xpReward: 100 },
      ],
    },
    {
      id: 'open-source-hero',
      title: 'Open Source Hero',
      description: 'Contribute to open source projects and build your reputation in the developer community',
      difficulty: 'Hard',
      xpReward: 800,
      timeLimit: '30 days',
      progress: 0,
      maxProgress: 10,
      status: 'not-started',
      category: 'Open Source',
      requirements: ['Git knowledge', 'Programming skills', 'Community mindset'],
      rewards: ['Open Source Contributor badge', '800 XP', 'Community recognition'],
      milestones: [
        { id: 'os-1', title: 'Find Projects', description: 'Identify 5 suitable projects', progress: 0, target: 5, completed: false, xpReward: 100 },
        { id: 'os-2', title: 'First Contribution', description: 'Make your first contribution', progress: 0, target: 1, completed: false, xpReward: 200 },
        { id: 'os-3', title: 'Bug Fixes', description: 'Fix 3 bugs in open source projects', progress: 0, target: 3, completed: false, xpReward: 300 },
        { id: 'os-4', title: 'Feature Implementation', description: 'Implement a new feature', progress: 0, target: 1, completed: false, xpReward: 200 },
      ],
    },
    {
      id: 'learning-marathon',
      title: 'Learning Marathon',
      description: 'Dedicate time to continuous learning and skill development',
      difficulty: 'Medium',
      xpReward: 600,
      timeLimit: '14 days',
      progress: 0,
      maxProgress: 30,
      status: 'not-started',
      category: 'Learning',
      requirements: ['Dedication', 'Time management', 'Learning resources'],
      rewards: ['Lifelong Learner badge', '600 XP', 'Knowledge expansion'],
      milestones: [
        { id: 'learn-1', title: 'Online Courses', description: 'Complete 3 online courses', progress: 0, target: 3, completed: false, xpReward: 200 },
        { id: 'learn-2', title: 'Technical Articles', description: 'Read 20 technical articles', progress: 0, target: 20, completed: false, xpReward: 150 },
        { id: 'learn-3', title: 'Documentation Study', description: 'Study 5 technology documentations', progress: 0, target: 5, completed: false, xpReward: 125 },
        { id: 'learn-4', title: 'Video Tutorials', description: 'Watch 15 hours of tutorials', progress: 0, target: 15, completed: false, xpReward: 125 },
      ],
    },
  ];
};

// Enhanced goals system
const generateGoals = (): Goal[] => {
  const now = new Date();
  return [
    {
      id: 'goal-1',
      title: 'Complete 100 LeetCode Problems',
      description: 'Solve 100 coding problems to improve algorithmic thinking and problem-solving skills',
      category: 'short-term',
      progress: 0,
      target: 100,
      unit: 'problems',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 'high',
      xpReward: 1000,
      tags: ['coding', 'algorithms', 'problem-solving'],
      estimatedHours: 50,
      actualHours: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'lc-1', title: 'Easy Problems', description: 'Solve 40 easy problems', progress: 0, target: 40, completed: false, xpReward: 200, dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) },
        { id: 'lc-2', title: 'Medium Problems', description: 'Solve 50 medium problems', progress: 0, target: 50, completed: false, xpReward: 400, dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000) },
        { id: 'lc-3', title: 'Hard Problems', description: 'Solve 10 hard problems', progress: 0, target: 10, completed: false, xpReward: 400, dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      ],
    },
    {
      id: 'goal-2',
      title: 'Build 5 Portfolio Projects',
      description: 'Create diverse projects showcasing different skills and technologies',
      category: 'long-term',
      progress: 0,
      target: 5,
      unit: 'projects',
      deadline: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 'high',
      xpReward: 1500,
      tags: ['portfolio', 'projects', 'development'],
      estimatedHours: 200,
      actualHours: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'proj-1', title: 'Frontend Project', description: 'Build a React application', progress: 0, target: 1, completed: false, xpReward: 300, dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000) },
        { id: 'proj-2', title: 'Backend API', description: 'Create a REST API', progress: 0, target: 1, completed: false, xpReward: 300, dueDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000) },
        { id: 'proj-3', title: 'Full-Stack App', description: 'Complete application with frontend and backend', progress: 0, target: 1, completed: false, xpReward: 400, dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) },
        { id: 'proj-4', title: 'Mobile App', description: 'Build a mobile application', progress: 0, target: 1, completed: false, xpReward: 350, dueDate: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000) },
        { id: 'proj-5', title: 'Open Source Contribution', description: 'Contribute to an open source project', progress: 0, target: 1, completed: false, xpReward: 150, dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) },
      ],
    },
    {
      id: 'goal-3',
      title: 'Land Software Engineering Internship',
      description: 'Secure an internship at a tech company to gain industry experience',
      category: 'career',
      progress: 0,
      target: 1,
      unit: 'internship',
      deadline: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 'high',
      xpReward: 2000,
      tags: ['career', 'internship', 'job-search'],
      estimatedHours: 100,
      actualHours: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'intern-1', title: 'Resume Optimization', description: 'Update and optimize resume', progress: 0, target: 1, completed: false, xpReward: 200, dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) },
        { id: 'intern-2', title: 'Apply to Companies', description: 'Submit 20 applications', progress: 0, target: 20, completed: false, xpReward: 400, dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
        { id: 'intern-3', title: 'Interview Preparation', description: 'Complete interview prep', progress: 0, target: 1, completed: false, xpReward: 600, dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) },
        { id: 'intern-4', title: 'Technical Interviews', description: 'Pass technical interviews', progress: 0, target: 3, completed: false, xpReward: 800, dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) },
      ],
    },
    {
      id: 'goal-4',
      title: 'Maintain 30-Day Learning Streak',
      description: 'Stay consistent with daily learning activities for 30 consecutive days',
      category: 'short-term',
      progress: 0,
      target: 30,
      unit: 'days',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 'medium',
      xpReward: 500,
      tags: ['learning', 'consistency', 'habits'],
      estimatedHours: 60,
      actualHours: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'streak-1', title: 'Week 1', description: 'Complete first week', progress: 0, target: 7, completed: false, xpReward: 100, dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
        { id: 'streak-2', title: 'Week 2', description: 'Complete second week', progress: 0, target: 7, completed: false, xpReward: 125, dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) },
        { id: 'streak-3', title: 'Week 3', description: 'Complete third week', progress: 0, target: 7, completed: false, xpReward: 125, dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000) },
        { id: 'streak-4', title: 'Week 4', description: 'Complete final week', progress: 0, target: 9, completed: false, xpReward: 150, dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      ],
    },
    {
      id: 'goal-5',
      title: 'Master React Development',
      description: 'Become proficient in React development with advanced concepts',
      category: 'long-term',
      progress: 0,
      target: 10,
      unit: 'skills',
      deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      priority: 'medium',
      xpReward: 800,
      tags: ['react', 'frontend', 'javascript'],
      estimatedHours: 80,
      actualHours: 0,
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'react-1', title: 'Basic Concepts', description: 'Learn components, props, state', progress: 0, target: 3, completed: false, xpReward: 150, dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000) },
        { id: 'react-2', title: 'Hooks Mastery', description: 'Master React hooks', progress: 0, target: 3, completed: false, xpReward: 200, dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
        { id: 'react-3', title: 'Advanced Patterns', description: 'Learn advanced React patterns', progress: 0, target: 2, completed: false, xpReward: 250, dueDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000) },
        { id: 'react-4', title: 'Testing & Performance', description: 'Testing and optimization', progress: 0, target: 2, completed: false, xpReward: 200, dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) },
      ],
    },
  ];
};

// Generate comprehensive task templates
const generateTaskTemplates = () => {
  return [
    // Web Development Tasks
    { title: 'Build a Responsive Landing Page', description: 'Create a modern, responsive landing page using HTML, CSS, and JavaScript', priority: 'Core', xp: 150, category: 'Web Development' },
    { title: 'Implement Dark Mode Toggle', description: 'Add dark/light mode functionality to a website', priority: 'Bonus', xp: 75, category: 'Web Development' },
    { title: 'Create a CSS Animation Library', description: 'Build reusable CSS animations for web projects', priority: 'Core', xp: 125, category: 'Web Development' },
    { title: 'Build a Progressive Web App', description: 'Convert a web app to PWA with offline functionality', priority: 'Elite', xp: 200, category: 'Web Development' },
    { title: 'Implement Lazy Loading', description: 'Add lazy loading for images and components', priority: 'Core', xp: 100, category: 'Web Development' },
    { title: 'Create a Component Library', description: 'Build reusable React/Vue components', priority: 'Elite', xp: 250, category: 'Web Development' },
    { title: 'Optimize Website Performance', description: 'Improve Core Web Vitals and loading speed', priority: 'Core', xp: 175, category: 'Web Development' },
    { title: 'Implement Authentication System', description: 'Add user login/signup with JWT tokens', priority: 'Elite', xp: 300, category: 'Web Development' },
    { title: 'Build a Real-time Chat App', description: 'Create chat application with WebSocket', priority: 'Elite', xp: 275, category: 'Web Development' },
    { title: 'Create API Documentation', description: 'Document REST API with Swagger/OpenAPI', priority: 'Core', xp: 100, category: 'Web Development' },
    { title: 'Implement Search Functionality', description: 'Add search with filters and pagination', priority: 'Core', xp: 150, category: 'Web Development' },
    { title: 'Build a Dashboard with Charts', description: 'Create analytics dashboard with data visualization', priority: 'Elite', xp: 225, category: 'Web Development' },
    { title: 'Add Internationalization (i18n)', description: 'Support multiple languages in web app', priority: 'Core', xp: 125, category: 'Web Development' },
    { title: 'Implement File Upload System', description: 'Add file upload with progress and validation', priority: 'Core', xp: 150, category: 'Web Development' },
    { title: 'Create a Blog CMS', description: 'Build content management system for blog', priority: 'Elite', xp: 300, category: 'Web Development' },
    { title: 'Build E-commerce Cart', description: 'Implement shopping cart with checkout flow', priority: 'Elite', xp: 275, category: 'Web Development' },
    { title: 'Add Social Media Integration', description: 'Integrate social login and sharing', priority: 'Core', xp: 125, category: 'Web Development' },
    { title: 'Implement Caching Strategy', description: 'Add Redis/memory caching for performance', priority: 'Core', xp: 150, category: 'Web Development' },
    { title: 'Build Notification System', description: 'Real-time notifications with push support', priority: 'Elite', xp: 200, category: 'Web Development' },
    { title: 'Create Admin Panel', description: 'Build admin interface for content management', priority: 'Elite', xp: 250, category: 'Web Development' },

    // Data Structures & Algorithms
    { title: 'Implement Binary Search Tree', description: 'Code BST with insert, delete, search operations', priority: 'Core', xp: 125, category: 'DSA' },
    { title: 'Solve Array Rotation Problems', description: 'Master array rotation algorithms', priority: 'Core', xp: 75, category: 'DSA' },
    { title: 'Build a Hash Table', description: 'Implement hash table from scratch', priority: 'Core', xp: 150, category: 'DSA' },
    { title: 'Master Dynamic Programming', description: 'Solve 20 DP problems on LeetCode', priority: 'Elite', xp: 300, category: 'DSA' },
    { title: 'Implement Graph Algorithms', description: 'Code DFS, BFS, Dijkstra algorithms', priority: 'Elite', xp: 250, category: 'DSA' },
    { title: 'Solve Sliding Window Problems', description: 'Master sliding window technique', priority: 'Core', xp: 100, category: 'DSA' },
    { title: 'Build a Trie Data Structure', description: 'Implement trie for string operations', priority: 'Core', xp: 125, category: 'DSA' },
    { title: 'Master Two Pointers Technique', description: 'Solve problems using two pointers', priority: 'Core', xp: 100, category: 'DSA' },
    { title: 'Implement Sorting Algorithms', description: 'Code merge sort, quick sort, heap sort', priority: 'Core', xp: 150, category: 'DSA' },
    { title: 'Solve Backtracking Problems', description: 'Master backtracking with N-Queens, Sudoku', priority: 'Elite', xp: 200, category: 'DSA' },
    { title: 'Build a Min/Max Heap', description: 'Implement heap data structure', priority: 'Core', xp: 125, category: 'DSA' },
    { title: 'Master Bit Manipulation', description: 'Solve bit manipulation problems', priority: 'Core', xp: 100, category: 'DSA' },
    { title: 'Implement Union-Find', description: 'Code disjoint set data structure', priority: 'Core', xp: 125, category: 'DSA' },
    { title: 'Solve Tree Traversal Problems', description: 'Master inorder, preorder, postorder', priority: 'Core', xp: 100, category: 'DSA' },
    { title: 'Build a Segment Tree', description: 'Implement segment tree for range queries', priority: 'Elite', xp: 200, category: 'DSA' },
    { title: 'Master String Algorithms', description: 'KMP, Rabin-Karp, Z-algorithm', priority: 'Elite', xp: 175, category: 'DSA' },
    { title: 'Solve Greedy Problems', description: 'Master greedy algorithm approach', priority: 'Core', xp: 125, category: 'DSA' },
    { title: 'Implement LRU Cache', description: 'Build LRU cache with O(1) operations', priority: 'Elite', xp: 175, category: 'DSA' },
    { title: 'Master Binary Search', description: 'Solve binary search variations', priority: 'Core', xp: 100, category: 'DSA' },
    { title: 'Build Expression Evaluator', description: 'Parse and evaluate mathematical expressions', priority: 'Elite', xp: 200, category: 'DSA' },

    // Machine Learning & AI
    { title: 'Build Linear Regression Model', description: 'Implement linear regression from scratch', priority: 'Core', xp: 150, category: 'Machine Learning' },
    { title: 'Create Image Classifier', description: 'Build CNN for image classification', priority: 'Elite', xp: 300, category: 'Machine Learning' },
    { title: 'Implement K-Means Clustering', description: 'Code K-means algorithm for clustering', priority: 'Core', xp: 125, category: 'Machine Learning' },
    { title: 'Build Recommendation System', description: 'Create collaborative filtering system', priority: 'Elite', xp: 250, category: 'Machine Learning' },
    { title: 'Implement Neural Network', description: 'Build neural network from scratch', priority: 'Elite', xp: 275, category: 'Machine Learning' },
    { title: 'Create Sentiment Analysis Model', description: 'Build NLP model for sentiment analysis', priority: 'Core', xp: 175, category: 'Machine Learning' },
    { title: 'Build Time Series Forecasting', description: 'Predict future values using historical data', priority: 'Elite', xp: 225, category: 'Machine Learning' },
    { title: 'Implement Decision Tree', description: 'Code decision tree algorithm', priority: 'Core', xp: 125, category: 'Machine Learning' },
    { title: 'Create Chatbot with NLP', description: 'Build conversational AI chatbot', priority: 'Elite', xp: 300, category: 'Machine Learning' },
    { title: 'Build Anomaly Detection System', description: 'Detect outliers in data streams', priority: 'Elite', xp: 200, category: 'Machine Learning' },
    { title: 'Implement Random Forest', description: 'Build ensemble learning algorithm', priority: 'Core', xp: 150, category: 'Machine Learning' },
    { title: 'Create Computer Vision App', description: 'Build object detection application', priority: 'Elite', xp: 275, category: 'Machine Learning' },
    { title: 'Build Feature Engineering Pipeline', description: 'Create automated feature engineering', priority: 'Core', xp: 125, category: 'Machine Learning' },
    { title: 'Implement Gradient Descent', description: 'Code optimization algorithm', priority: 'Core', xp: 100, category: 'Machine Learning' },
    { title: 'Create Data Visualization Dashboard', description: 'Build ML model performance dashboard', priority: 'Core', xp: 150, category: 'Machine Learning' },

    // DevOps & Cloud
    { title: 'Set up CI/CD Pipeline', description: 'Configure automated deployment pipeline', priority: 'Elite', xp: 200, category: 'DevOps' },
    { title: 'Containerize Application', description: 'Create Docker containers for app deployment', priority: 'Core', xp: 125, category: 'DevOps' },
    { title: 'Deploy to AWS/Azure', description: 'Deploy application to cloud platform', priority: 'Core', xp: 150, category: 'DevOps' },
    { title: 'Set up Monitoring System', description: 'Implement application monitoring and alerts', priority: 'Core', xp: 125, category: 'DevOps' },
    { title: 'Configure Load Balancer', description: 'Set up load balancing for high availability', priority: 'Elite', xp: 175, category: 'DevOps' },
    { title: 'Implement Infrastructure as Code', description: 'Use Terraform/CloudFormation for infrastructure', priority: 'Elite', xp: 200, category: 'DevOps' },
    { title: 'Set up Database Backup', description: 'Configure automated database backups', priority: 'Core', xp: 100, category: 'DevOps' },
    { title: 'Configure SSL/TLS', description: 'Set up HTTPS with SSL certificates', priority: 'Core', xp: 75, category: 'DevOps' },
    { title: 'Implement Log Aggregation', description: 'Set up centralized logging system', priority: 'Core', xp: 125, category: 'DevOps' },
    { title: 'Set up Kubernetes Cluster', description: 'Deploy and manage Kubernetes cluster', priority: 'Elite', xp: 250, category: 'DevOps' },
    { title: 'Configure Auto-scaling', description: 'Set up automatic scaling based on load', priority: 'Elite', xp: 175, category: 'DevOps' },
    { title: 'Implement Security Scanning', description: 'Add security vulnerability scanning', priority: 'Core', xp: 125, category: 'DevOps' },
    { title: 'Set up CDN', description: 'Configure content delivery network', priority: 'Core', xp: 100, category: 'DevOps' },
    { title: 'Configure Environment Variables', description: 'Manage secrets and configuration', priority: 'Core', xp: 75, category: 'DevOps' },
    { title: 'Implement Blue-Green Deployment', description: 'Set up zero-downtime deployment strategy', priority: 'Elite', xp: 200, category: 'DevOps' },

    // Mobile Development
    { title: 'Build React Native App', description: 'Create cross-platform mobile application', priority: 'Elite', xp: 250, category: 'Mobile Development' },
    { title: 'Implement Push Notifications', description: 'Add push notification functionality', priority: 'Core', xp: 125, category: 'Mobile Development' },
    { title: 'Create Offline-First App', description: 'Build app that works without internet', priority: 'Elite', xp: 200, category: 'Mobile Development' },
    { title: 'Implement Biometric Authentication', description: 'Add fingerprint/face ID login', priority: 'Core', xp: 150, category: 'Mobile Development' },
    { title: 'Build Camera Integration', description: 'Add photo/video capture functionality', priority: 'Core', xp: 125, category: 'Mobile Development' },
    { title: 'Create Location-Based Features', description: 'Implement GPS and mapping features', priority: 'Core', xp: 150, category: 'Mobile Development' },
    { title: 'Build Social Media App', description: 'Create Instagram-like mobile app', priority: 'Elite', xp: 300, category: 'Mobile Development' },
    { title: 'Implement In-App Purchases', description: 'Add payment functionality to mobile app', priority: 'Elite', xp: 175, category: 'Mobile Development' },
    { title: 'Create Fitness Tracking App', description: 'Build health and fitness mobile app', priority: 'Elite', xp: 225, category: 'Mobile Development' },
    { title: 'Build AR/VR Experience', description: 'Create augmented reality mobile experience', priority: 'Elite', xp: 275, category: 'Mobile Development' },

    // Interview Preparation
    { title: 'Practice System Design', description: 'Study and practice system design problems', priority: 'Elite', xp: 200, category: 'Interview Prep' },
    { title: 'Mock Interview Session', description: 'Complete technical mock interview', priority: 'Core', xp: 150, category: 'Interview Prep' },
    { title: 'Behavioral Questions Prep', description: 'Prepare answers for behavioral questions', priority: 'Core', xp: 100, category: 'Interview Prep' },
    { title: 'Company Research', description: 'Research target companies and roles', priority: 'Core', xp: 75, category: 'Interview Prep' },
    { title: 'Salary Negotiation Practice', description: 'Learn and practice salary negotiation', priority: 'Core', xp: 100, category: 'Interview Prep' },
    { title: 'Technical Presentation', description: 'Prepare technical presentation for interviews', priority: 'Core', xp: 125, category: 'Interview Prep' },
    { title: 'Code Review Practice', description: 'Practice reviewing and explaining code', priority: 'Core', xp: 100, category: 'Interview Prep' },
    { title: 'Whiteboard Coding', description: 'Practice coding on whiteboard/paper', priority: 'Core', xp: 125, category: 'Interview Prep' },
    { title: 'Follow-up Questions Prep', description: 'Prepare thoughtful questions for interviewers', priority: 'Bonus', xp: 50, category: 'Interview Prep' },
    { title: 'Portfolio Presentation', description: 'Prepare to present portfolio projects', priority: 'Core', xp: 100, category: 'Interview Prep' },

    // Networking & Professional Development
    { title: 'Attend Tech Meetup', description: 'Participate in local tech community event', priority: 'Core', xp: 100, category: 'Networking' },
    { title: 'Write Technical Blog Post', description: 'Share knowledge through technical writing', priority: 'Core', xp: 125, category: 'Networking' },
    { title: 'Contribute to Open Source', description: 'Make meaningful open source contribution', priority: 'Elite', xp: 200, category: 'Networking' },
    { title: 'Mentor Junior Developer', description: 'Help someone learn programming', priority: 'Core', xp: 150, category: 'Networking' },
    { title: 'Give Technical Talk', description: 'Present at conference or meetup', priority: 'Elite', xp: 250, category: 'Networking' },
    { title: 'Join Developer Community', description: 'Actively participate in online communities', priority: 'Bonus', xp: 75, category: 'Networking' },
    { title: 'Create YouTube Tutorial', description: 'Make educational programming video', priority: 'Core', xp: 150, category: 'Networking' },
    { title: 'Start Tech Podcast', description: 'Launch podcast about technology', priority: 'Elite', xp: 200, category: 'Networking' },
    { title: 'Organize Study Group', description: 'Lead group learning sessions', priority: 'Core', xp: 125, category: 'Networking' },
    { title: 'Build Personal Brand', description: 'Establish online professional presence', priority: 'Core', xp: 100, category: 'Networking' },

    // Learning & Skill Development
    { title: 'Complete Online Course', description: 'Finish comprehensive programming course', priority: 'Core', xp: 150, category: 'Learning' },
    { title: 'Read Technical Book', description: 'Study programming or CS fundamentals book', priority: 'Core', xp: 125, category: 'Learning' },
    { title: 'Learn New Programming Language', description: 'Become proficient in new language', priority: 'Elite', xp: 200, category: 'Learning' },
    { title: 'Master New Framework', description: 'Learn popular web/mobile framework', priority: 'Core', xp: 175, category: 'Learning' },
    { title: 'Study Design Patterns', description: 'Learn common software design patterns', priority: 'Core', xp: 125, category: 'Learning' },
    { title: 'Learn Database Design', description: 'Master database modeling and optimization', priority: 'Core', xp: 150, category: 'Learning' },
    { title: 'Study Computer Networks', description: 'Understand networking protocols and concepts', priority: 'Core', xp: 125, category: 'Learning' },
    { title: 'Learn Cybersecurity Basics', description: 'Understand security principles and practices', priority: 'Core', xp: 150, category: 'Learning' },
    { title: 'Master Git Workflows', description: 'Learn advanced Git commands and workflows', priority: 'Core', xp: 100, category: 'Learning' },
    { title: 'Study Software Architecture', description: 'Learn architectural patterns and principles', priority: 'Elite', xp: 175, category: 'Learning' },
  ];
};

const initialState: AppState = {
  user: null,
  tasks: [],
  codingStats: {
    totalSolved: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    todaysSolved: 0,
    weeklyTarget: 7,
    averageTime: 0,
    totalXP: 0,
    platformStats: {
      leetcode: {
        totalSolved: 0,
        ranking: 0,
        acceptanceRate: 0,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        contestRating: 0,
        badges: [],
      },
      geeksforgeeks: {
        totalSolved: 0,
        institutionRank: 0,
        codingScore: 0,
        problemsSolved: 0,
        articlesPublished: 0,
      },
      codechef: {
        currentRating: 0,
        maxRating: 0,
        globalRank: 0,
        countryRank: 0,
        stars: 0,
        problemsSolved: 0,
      },
    },
    contestRatings: {
      leetcode: 0,
      codechef: 0,
      codeforces: 0,
      atcoder: 0,
    },
    lastUpdated: new Date(),
  },
  githubStats: null,
  platformStats: null,
  performanceMetrics: null,
  integrationStatus: {
    github: false,
    leetcode: false,
    geeksforgeeks: false,
    codechef: false,
    linkedin: false,
  },
  notifications: [],
  achievements: [],
  milestones: [],
  careerStats: { knowledge: 0, mindset: 0, communication: 0, portfolio: 0 },
  badges: generateBadges(),
  dailyMissions: generateDailyMissions(),
  sideQuests: generateSideQuests(),
  skills: generateSkills(),
  challenges: generateChallenges(),
  goals: generateGoals(),
  codingStats: {
    totalSolved: 0,
    currentStreak: 0,
    longestStreak: 0,
    todaysSolved: 0,
    weeklyTarget: 10,
    weeklyProgress: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    platformStats: {
      leetcode: 0,
      geeksforgeeks: 0,
      codechef: 0,
    },
    topicStats: {},
  },
  xpSystem: {
    currentXP: 0,
    currentLevel: 1,
    xpToNextLevel: 100,
    totalXPEarned: 0,
    xpMultiplier: 1,
    bonusXPActive: false,
  },
  socialStats: {
    followers: Math.floor(Math.random() * 50) + 10,
    following: Math.floor(Math.random() * 100) + 20,
    profileViews: Math.floor(Math.random() * 200) + 50,
    applauds: Math.floor(Math.random() * 30) + 5,
    rank: Math.floor(Math.random() * 1000) + 100,
    totalUsers: 10000,
  },
  darkMode: localStorage.getItem('darkMode') === 'true',
  isSetupComplete: false,
  loading: true,
  notifications: [],
  showLevelUpAnimation: false,
  showBadgeUnlock: false,
  showConfetti: false,
  recentRewards: [],
  activeTheme: 'default',
  unlockedThemes: ['default'],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isSetupComplete: true };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'UPDATE_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.map(milestone =>
          milestone.id === action.payload.id ? action.payload : milestone
        ),
      };
    
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload
            ? { ...achievement, unlocked: true, unlockedAt: new Date() }
            : achievement
        ),
      };
    
    case 'UPDATE_STATS':
      return {
        ...state,
        careerStats: { ...state.careerStats, ...action.payload },
      };
    
    case 'SET_CAREER_STATS':
      return { ...state, careerStats: action.payload };
    
    case 'UPDATE_CODING_STATS':
      return {
        ...state,
        codingStats: { ...state.codingStats, ...action.payload },
      };
    
    case 'SET_BADGES':
      return { ...state, badges: action.payload };
    
    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map(badge =>
          badge.id === action.payload
            ? { ...badge, unlocked: true, unlockedAt: new Date() }
            : badge
        ),
        showBadgeUnlock: true,
      };
    
    case 'SET_DAILY_MISSIONS':
      return { ...state, dailyMissions: action.payload };
    
    case 'COMPLETE_MISSION':
      return {
        ...state,
        dailyMissions: state.dailyMissions.map(mission =>
          mission.id === action.payload
            ? { ...mission, completed: true }
            : mission
        ),
      };
    
    case 'SET_SIDE_QUESTS':
      return { ...state, sideQuests: action.payload };
    
    case 'COMPLETE_SIDE_QUEST':
      return {
        ...state,
        sideQuests: state.sideQuests.map(quest =>
          quest.id === action.payload
            ? { ...quest, completed: true }
            : quest
        ),
      };
    
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id ? action.payload : skill
        ),
      };
    
    case 'PRACTICE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill => {
          if (skill.id === action.payload.skillId) {
            const updatedActivities = skill.practiceActivities.map(activity =>
              activity.id === action.payload.activityId
                ? { ...activity, completed: true }
                : activity
            );
            const newXP = skill.xp + 25;
            const newLevel = Math.floor(newXP / skill.xpRequired) + 1;
            return {
              ...skill,
              practiceActivities: updatedActivities,
              xp: newXP,
              level: Math.min(newLevel, skill.maxLevel),
            };
          }
          return skill;
        }),
      };
    
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id ? action.payload : challenge
        ),
      };
    
    case 'START_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload
            ? { ...challenge, status: 'in-progress', startedAt: new Date() }
            : challenge
        ),
      };
    
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload
            ? { ...challenge, status: 'completed', completedAt: new Date(), progress: challenge.maxProgress }
            : challenge
        ),
      };
    
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    
    case 'ADD_GOAL':
      return { ...state, goals: [action.payload, ...state.goals] };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? { ...action.payload, updatedAt: new Date() } : goal
        ),
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
      };
    
    case 'TOGGLE_DARK_MODE':
      const newDarkMode = !state.darkMode;
    
    case 'UPDATE_CODING_STATS':
      return { 
        ...state, 
        codingStats: { ...state.codingStats, ...action.payload }
      };
    
    case 'UPDATE_GITHUB_STATS':
      return { ...state, githubStats: action.payload };
    
    case 'UPDATE_PLATFORM_STATS':
      return { 
        ...state, 
        platformStats: { ...state.platformStats, ...action.payload }
      };
    
    case 'UPDATE_PERFORMANCE_METRICS':
      return { ...state, performanceMetrics: action.payload };
    
    case 'UPDATE_INTEGRATION_STATUS':
      return { 
        ...state, 
        integrationStatus: { ...state.integrationStatus, ...action.payload }
      };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications].slice(0, 50) // Keep last 50
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      localStorage.setItem('darkMode', newDarkMode.toString());
      return { ...state, darkMode: newDarkMode };
    
    case 'COMPLETE_SETUP':
      return { ...state, isSetupComplete: true };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'ADD_XP':
      const { amount, source, multiplier = 1 } = action.payload;
      const finalAmount = Math.floor(amount * multiplier * state.xpSystem.xpMultiplier);
      const newTotalXP = state.xpSystem.currentXP + finalAmount;
      const newLevel = calculateLevelFromXP(newTotalXP);
      const leveledUp = newLevel > state.xpSystem.currentLevel;
      const newXPToNext = calculateXPToNextLevel(newTotalXP, newLevel);
      
      // Check for badge unlocks
      const newlyUnlockedBadges = state.badges.filter(badge => 
        !badge.unlocked && newTotalXP >= badge.xpRequired
      );
      
      // Random reward chance (20%)
      const randomReward = Math.random() < 0.2 ? [
        '🎁 Mystery Box unlocked!',
        '⚡ +0.2 Stat Boost (48h)',
        '🌟 Dark Warrior Mode Theme Unlocked',
        '🎰 Lucky Bonus: +50 XP',
        '🔥 Streak Multiplier x2',
      ][Math.floor(Math.random() * 5)] : null;
      
      const newNotifications = [
        ...state.notifications,
        {
          id: Date.now().toString(),
          type: 'achievement' as const,
          title: `+${finalAmount} XP Earned! ⚡`,
          message: `From: ${source}`,
          timestamp: new Date(),
          read: false,
          priority: 'medium' as const,
        },
        ...(leveledUp ? [{
          id: (Date.now() + 1).toString(),
          type: 'level-up' as const,
          title: 'Level Up! 🎉',
          message: `Congratulations! You've reached Level ${newLevel}!`,
          timestamp: new Date(),
          read: false,
          priority: 'high' as const,
        }] : []),
        ...(newlyUnlockedBadges.map(badge => ({
          id: (Date.now() + Math.random()).toString(),
          type: 'badge' as const,
          title: 'Badge Unlocked! 🏆',
          message: `You earned the "${badge.name}" badge!`,
          timestamp: new Date(),
          read: false,
          priority: 'high' as const,
        }))),
        ...(randomReward ? [{
          id: (Date.now() + 2).toString(),
          type: 'reward' as const,
          title: 'Lucky Reward! 🎰',
          message: randomReward,
          timestamp: new Date(),
          read: false,
          priority: 'high' as const,
        }] : []),
      ].slice(0, 10);
      
      return {
        ...state,
        xpSystem: {
          ...state.xpSystem,
          currentXP: newTotalXP,
          currentLevel: newLevel,
          xpToNextLevel: newXPToNext,
          totalXPEarned: state.xpSystem.totalXPEarned + finalAmount,
        },
        badges: state.badges.map(badge => 
          newlyUnlockedBadges.some(nb => nb.id === badge.id)
            ? { ...badge, unlocked: true, unlockedAt: new Date() }
            : badge
        ),
        notifications: newNotifications,
        showLevelUpAnimation: leveledUp,
        showBadgeUnlock: newlyUnlockedBadges.length > 0,
        showConfetti: leveledUp || newlyUnlockedBadges.length > 0,
        recentRewards: randomReward ? [randomReward, ...state.recentRewards.slice(0, 4)] : state.recentRewards,
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    
    case 'SOLVE_PROBLEM':
      const { xp, difficulty, platform, topic } = action.payload;
      const difficultyMultiplier = difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1;
      const newCodingStats = {
        ...state.codingStats,
        totalSolved: state.codingStats.totalSolved + 1,
        todaysSolved: state.codingStats.todaysSolved + 1,
        weeklyProgress: state.codingStats.weeklyProgress + 1,
        [`${difficulty.toLowerCase()}Count`]: state.codingStats[`${difficulty.toLowerCase()}Count` as keyof typeof state.codingStats] + 1,
        platformStats: {
          ...state.codingStats.platformStats,
          [platform.toLowerCase()]: (state.codingStats.platformStats[platform.toLowerCase() as keyof typeof state.codingStats.platformStats] || 0) + 1,
        },
        topicStats: {
          ...state.codingStats.topicStats,
          [topic]: (state.codingStats.topicStats[topic] || 0) + 1,
        },
      };
      
      const statBoost = difficultyMultiplier * 2;
      const newCareerStats = {
        ...state.careerStats,
        knowledge: Math.min(100, state.careerStats.knowledge + statBoost),
      };

      return {
        ...state,
        codingStats: newCodingStats,
        careerStats: newCareerStats,
      };
    
    case 'SHOW_LEVEL_UP_ANIMATION':
      return { ...state, showLevelUpAnimation: action.payload };
    
    case 'SHOW_BADGE_UNLOCK':
      return { ...state, showBadgeUnlock: action.payload };
    
    case 'SHOW_CONFETTI':
      return { ...state, showConfetti: action.payload };
    
    case 'ADD_REWARD':
      return {
        ...state,
        recentRewards: [action.payload, ...state.recentRewards.slice(0, 4)],
      };
    
    case 'UPDATE_SOCIAL_STATS':
      return {
        ...state,
        socialStats: { ...state.socialStats, ...action.payload },
      };
    
    case 'ACTIVATE_BONUS_XP':
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + action.payload.duration);
      return {
        ...state,
        xpSystem: {
          ...state.xpSystem,
          xpMultiplier: action.payload.multiplier,
          bonusXPActive: true,
          bonusXPExpiry: expiryTime,
        },
      };
    
    case 'CHANGE_THEME':
      return { ...state, activeTheme: action.payload };
    
    case 'UNLOCK_THEME':
      return {
        ...state,
        unlockedThemes: [...state.unlockedThemes, action.payload],
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadUserData() {
      if (!authUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        // Load profile
        const profile = await profileService.getProfile(authUser.id);
        
        if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            degree: profile.degree,
            branch: profile.branch,
            year: profile.year,
            interests: profile.interests,
            careerGoal: profile.career_goal,
            avatar: profile.avatar,
            level: profile.level,
            xp: profile.xp,
            tier: profile.tier as 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Mythic',
            streak: profile.streak,
            lastActivity: new Date(profile.last_activity),
          };
          dispatch({ type: 'SET_USER', payload: user });

          // Load tasks
          const tasks = await taskService.getTasks(authUser.id);
          dispatch({ type: 'SET_TASKS', payload: tasks });

          // Load achievements
          const achievements = await achievementService.getUserAchievements(authUser.id);
          dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });

          // Load career stats
          const careerStats = await profileService.getCareerStats(authUser.id);
          dispatch({ type: 'SET_CAREER_STATS', payload: careerStats });

          // Load coding stats
          const codingStreak = await codingService.getCodingStreak(authUser.id);
          dispatch({ type: 'UPDATE_CODING_STATS', payload: {
            currentStreak: codingStreak.currentStreak,
            longestStreak: codingStreak.longestStreak,
            totalSolved: codingStreak.totalProblemsSolved,
          }});

          // Initialize XP system with user data
          dispatch({ type: 'ADD_XP', payload: { amount: 0, source: 'initialization' } });

          // Add welcome notification for new users
          if (user.xp === 100) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
              id: Date.now().toString(),
              type: 'achievement',
              title: 'Welcome to Career Quest! 🚀',
              message: 'Your journey to career success starts now. Complete tasks, solve problems, and level up!',
              timestamp: new Date(),
              read: false,
              priority: 'high',
            }});
          }

          // Simulate social interactions
          setInterval(() => {
            const socialEvents = [
              { type: 'applaud', message: '👏 Someone applauded your progress!' },
              { type: 'view', message: '👀 Your profile was viewed by a recruiter!' },
              { type: 'follow', message: '🤝 A new developer started following you!' },
              { type: 'rival', message: '🚨 A rival passed your XP! Time to catch up!' },
            ];
            
            if (Math.random() < 0.3) { // 30% chance every interval
              const event = socialEvents[Math.floor(Math.random() * socialEvents.length)];
              dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: Date.now().toString(),
                type: 'social',
                title: 'Social Update',
                message: event.message,
                timestamp: new Date(),
                read: false,
                priority: 'low',
              }});
              
              // Update social stats
              if (event.type === 'applaud') {
                dispatch({ type: 'UPDATE_SOCIAL_STATS', payload: { applauds: state.socialStats.applauds + 1 } });
              } else if (event.type === 'view') {
                dispatch({ type: 'UPDATE_SOCIAL_STATS', payload: { profileViews: state.socialStats.profileViews + 1 } });
              } else if (event.type === 'follow') {
                dispatch({ type: 'UPDATE_SOCIAL_STATS', payload: { followers: state.socialStats.followers + 1 } });
              }
            }
          }, 30000); // Every 30 seconds
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  // Auto-save user data when it changes
  useEffect(() => {
    if (state.user && authUser) {
      profileService.updateProfile(authUser.id, state.user).catch(console.error);
    }
  }, [state.user, authUser]);

  // Auto-save career stats when they change
  useEffect(() => {
    if (authUser && state.careerStats) {
      profileService.updateCareerStats(authUser.id, state.careerStats).catch(console.error);
    }
  }, [state.careerStats, authUser]);

  // Check for bonus XP expiry
  useEffect(() => {
    if (state.xpSystem.bonusXPActive && state.xpSystem.bonusXPExpiry) {
      const now = new Date();
      if (now > state.xpSystem.bonusXPExpiry) {
        dispatch({ type: 'ACTIVATE_BONUS_XP', payload: { multiplier: 1, duration: 0 } });
      }
    }
  }, [state.xpSystem.bonusXPActive, state.xpSystem.bonusXPExpiry]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};