import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Code, 
  Trophy, 
  Calendar,
  Zap,
  GitBranch,
  Star,
  Users,
  Award,
  Activity,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { IntegrationService } from '../../services/integrationService';
import { AnalyticsService } from '../../services/analyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function EnhancedDashboard() {
  const { state, dispatch } = useApp();
  const { user: authUser } = useAuth();
  const { darkMode, user, tasks, codingStats } = state;
  const [realTimeStats, setRealTimeStats] = useState<any>(null);
  const [githubStats, setGithubStats] = useState<any>(null);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [authUser]);

  const loadDashboardData = async () => {
    if (!authUser) return;
    
    try {
      // Load real-time metrics
      const metrics = await AnalyticsService.getPerformanceMetrics(authUser.id);
      setRealTimeStats(metrics);

      // Load GitHub stats if connected
      if (user?.githubUsername) {
        const github = await IntegrationService.fetchGitHubStats(user.githubUsername);
        setGithubStats(github);
      }

      // Load platform stats if connected
      if (user?.leetcodeUsername) {
        const leetcode = await IntegrationService.fetchLeetCodeStats(user.leetcodeUsername);
        setPlatformStats(prev => ({ ...prev, leetcode }));
      }

      // Generate insights
      const userInsights = await AnalyticsService.generateInsights(authUser.id);
      setInsights(userInsights);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadDashboardData();
  };

  // Calculate real-time metrics
  const todayXP = realTimeStats?.dailyXP
    .filter((day: any) => day.date === new Date().toISOString().split('T')[0])
    .reduce((sum: number, day: any) => sum + day.xp, 0) || 0;

  const weeklyXP = realTimeStats?.weeklyProgress
    .slice(-1)[0]?.xp || 0;

  const completedToday = tasks.filter(task => 
    task.completed && 
    task.createdAt.toDateString() === new Date().toDateString()
  ).length;

  const activeTasks = tasks.filter(task => !task.completed).length;

  const stats = [
    {
      title: 'Today\'s XP',
      value: todayXP.toLocaleString(),
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Active Tasks',
      value: activeTasks,
      icon: Target,
      color: 'from-blue-400 to-cyan-500',
      change: `${completedToday} completed today`,
      trend: 'up',
    },
    {
      title: 'Current Streak',
      value: user?.streak || 0,
      icon: Calendar,
      color: 'from-orange-400 to-red-500',
      change: user?.streak && user.streak > 0 ? 'Keep it up!' : 'Start today!',
      trend: user?.streak && user.streak > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Total Level',
      value: user?.level || 1,
      icon: TrendingUp,
      color: 'from-purple-400 to-pink-500',
      change: `${user?.tier} tier`,
      trend: 'up',
    },
  ];

  if (loading) {
    return (
      <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name}! 🚀
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Here's your real-time performance overview
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center space-x-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-purple-500`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.title}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                  <TrendingUp className={`h-4 w-4 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Performance Trends
              </h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realTimeStats?.dailyXP.slice(-30) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="xp"
                      stroke="#8B5CF6"
                      fill="url(#xpGradient)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      stroke="#10B981"
                      fill="url(#taskGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Platform Integration Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connected Platforms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub Card */}
                {githubStats && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-gray-600`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="h-5 w-5 text-gray-600" />
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          GitHub
                        </span>
                      </div>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        href={`https://github.com/${githubStats.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.publicRepos}
                        </div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Repositories
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.totalStars}
                        </div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Total Stars
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LeetCode Card */}
                {platformStats?.leetcode && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-orange-500`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-orange-500" />
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          LeetCode
                        </span>
                      </div>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        href={`https://leetcode.com/${user?.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {platformStats.leetcode.totalSolved}
                        </div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Problems Solved
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          #{platformStats.leetcode.ranking.toLocaleString()}
                        </div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Global Rank
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add more platform cards as needed */}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Insights & Quick Actions */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Insights 🤖
              </h3>
              
              <div className="space-y-3">
                {insights.length > 0 ? insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      insight.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                      'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <h4 className={`font-semibold mb-1 ${
                      insight.priority === 'high' ? 'text-red-800 dark:text-red-200' :
                      insight.priority === 'medium' ? 'text-yellow-800 dark:text-yellow-200' :
                      'text-blue-800 dark:text-blue-200'
                    }`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm ${
                      insight.priority === 'high' ? 'text-red-600 dark:text-red-300' :
                      insight.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-300' :
                      'text-blue-600 dark:text-blue-300'
                    }`}>
                      {insight.message}
                    </p>
                  </motion.div>
                )) : (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                    <Activity className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Keep using the platform to get personalized insights!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Productivity Score
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {realTimeStats?.productivityScore || 0}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Consistency Score
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {realTimeStats?.consistencyScore || 0}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Learning Velocity
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {realTimeStats?.learningVelocity || 0}/100
                  </span>
                </div>

                {githubStats && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        GitHub Commits
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {githubStats.totalCommits.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Contribution Streak
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {githubStats.contributionStreak} days
                      </span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Achievements
              </h3>
              
              <div className="space-y-3">
                {state.achievements
                  .filter(a => a.unlocked)
                  .slice(-3)
                  .map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {achievement.title}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          +{achievement.xp} XP
                        </div>
                      </div>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}