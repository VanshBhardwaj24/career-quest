import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Calendar,
  Award,
  Brain,
  Code,
  GitBranch,
  Star,
  Activity,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { AnalyticsService } from '../../services/analyticsService';
import { PerformanceMetrics } from '../../types';

export function RealTimeAnalytics() {
  const { state } = useApp();
  const { user: authUser } = useAuth();
  const { darkMode, user } = state;
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'xp' | 'tasks' | 'problems'>('xp');

  useEffect(() => {
    loadMetrics();
    
    // Set up real-time updates
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [authUser, selectedTimeframe]);

  const loadMetrics = async () => {
    if (!authUser) return;
    
    try {
      const data = await AnalyticsService.getPerformanceMetrics(authUser.id);
      setMetrics(data);
      
      // Track analytics view
      await AnalyticsService.trackEvent(authUser.id, 'analytics_viewed', {
        timeframe: selectedTimeframe,
        metric: selectedMetric,
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!metrics) return [];
    
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
    return metrics.dailyXP.slice(-days);
  };

  const getInsightColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  // Language distribution for pie chart
  const languageData = [
    { name: 'JavaScript', value: 35, color: '#F7DF1E' },
    { name: 'Python', value: 25, color: '#3776AB' },
    { name: 'Java', value: 20, color: '#ED8B00' },
    { name: 'C++', value: 15, color: '#00599C' },
    { name: 'Other', value: 5, color: '#6B7280' },
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
            <div className="h-80 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Real-Time Analytics 📊
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Deep insights into your learning patterns and performance metrics
          </p>
        </div>

        {/* Performance Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getInsightColor(metrics?.productivityScore || 0)}`}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Productivity Score
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getScoreLabel(metrics?.productivityScore || 0)}
                  </p>
                </div>
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.productivityScore || 0}
              </div>
            </div>
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics?.productivityScore || 0}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${getInsightColor(metrics?.productivityScore || 0)}`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getInsightColor(metrics?.consistencyScore || 0)}`}>
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Consistency Score
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getScoreLabel(metrics?.consistencyScore || 0)}
                  </p>
                </div>
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.consistencyScore || 0}
              </div>
            </div>
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics?.consistencyScore || 0}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full rounded-full bg-gradient-to-r ${getInsightColor(metrics?.consistencyScore || 0)}`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getInsightColor(metrics?.learningVelocity || 0)}`}>
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Learning Velocity
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getScoreLabel(metrics?.learningVelocity || 0)}
                  </p>
                </div>
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.learningVelocity || 0}
              </div>
            </div>
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics?.learningVelocity || 0}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className={`h-full rounded-full bg-gradient-to-r ${getInsightColor(metrics?.learningVelocity || 0)}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
              Timeframe:
            </span>
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <motion.button
                key={timeframe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {timeframe === '7d' ? 'Last 7 days' : timeframe === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
              Metric:
            </span>
            {(['xp', 'tasks', 'problems'] as const).map((metric) => (
              <motion.button
                key={metric}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  selectedMetric === metric
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {metric === 'xp' ? 'XP Gained' : metric === 'tasks' ? 'Tasks Done' : 'Problems Solved'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Performance Trends
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
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
                    color: darkMode ? '#FFFFFF' : '#000000',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#8B5CF6"
                  fill="url(#gradient)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Weekly Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.weeklyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="week" stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="xp" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tasks" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Language Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Skill Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Skill Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
        >
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Skill Progression
          </h3>
          
          <div className="space-y-4">
            {metrics?.skillProgression.map((skill, index) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-24 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {skill.skill}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Level {skill.level}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {skill.xp} XP
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.level / 5) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
                <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round((skill.level / 5) * 100)}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Live Activity Feed
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Live
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { action: 'Solved LeetCode Medium Problem', time: '2 minutes ago', xp: 100, icon: Code },
              { action: 'Completed Daily Challenge', time: '1 hour ago', xp: 150, icon: Target },
              { action: 'GitHub Commit Pushed', time: '3 hours ago', xp: 25, icon: GitBranch },
              { action: 'Task Completed', time: '5 hours ago', xp: 75, icon: CheckCircle },
              { action: 'New Achievement Unlocked', time: '1 day ago', xp: 200, icon: Award },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } hover:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      +{activity.xp}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}