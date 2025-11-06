export interface User {
  id: string;
  name: string;
  email: string;
  degree: string;
  branch: string;
  year: number;
  interests: string[];
  careerGoal: string;
  avatar: string;
  level: number;
  xp: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Mythic';
  streak: number;
  lastActivity: Date;
  githubUsername?: string;
  leetcodeUsername?: string;
  geeksforgeeksUsername?: string;
  codechefUsername?: string;
  linkedinUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Elite' | 'Core' | 'Bonus';
  completed: boolean;
  xp: number;
  category: string;
  dueDate: Date;
  createdAt: Date;
  streak: number;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic';
  xp: number;
}

export interface CareerStats {
  knowledge: number;
  mindset: number;
  communication: number;
  portfolio: number;
}

export interface CodingStats {
  totalSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  currentStreak: number;
  longestStreak: number;
  todaysSolved: number;
  weeklyTarget: number;
  averageTime: number;
  totalXP: number;
  platformStats: PlatformStats;
  contestRatings: ContestRatings;
  lastUpdated: Date;
}

export interface PlatformStats {
  leetcode: {
    totalSolved: number;
    ranking: number;
    acceptanceRate: number;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    contestRating: number;
    badges: string[];
  };
  geeksforgeeks: {
    totalSolved: number;
    institutionRank: number;
    codingScore: number;
    problemsSolved: number;
    articlesPublished: number;
  };
  codechef: {
    currentRating: number;
    maxRating: number;
    globalRank: number;
    countryRank: number;
    stars: number;
    problemsSolved: number;
  };
}

export interface ContestRatings {
  leetcode: number;
  codechef: number;
  codeforces: number;
  atcoder: number;
}

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  contributionStreak: number;
  languageStats: { [key: string]: number };
  topRepositories: Repository[];
  contributionGraph: ContributionDay[];
  lastUpdated: Date;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  lastUpdated: Date;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'level-up' | 'task-completed' | 'streak' | 'challenge' | 'problem-solved' | 'milestone' | 'reward' | 'integration';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  category: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  maxProgress: number;
  xpReward: number;
  timeLimit: string;
  requirements: string[];
  rewards: string[];
  milestones: ChallengeMilestone[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface ChallengeMilestone {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
}

export interface PerformanceMetrics {
  dailyXP: { date: string; xp: number; tasks: number }[];
  weeklyProgress: { week: string; xp: number; tasks: number; problems: number }[];
  monthlyGrowth: { month: string; level: number; xp: number }[];
  skillProgression: { skill: string; level: number; xp: number; date: string }[];
  productivityScore: number;
  consistencyScore: number;
  learningVelocity: number;
}

export interface IntegrationStatus {
  github: boolean;
  leetcode: boolean;
  geeksforgeeks: boolean;
  codechef: boolean;
  linkedin: boolean;
  lastSyncTime?: Date;
}