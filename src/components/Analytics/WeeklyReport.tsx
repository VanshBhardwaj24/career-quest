import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function WeeklyReport() {
  const { state } = useApp();
  const { darkMode, tasks, user } = state;

  // Generate mock weekly data
  const weeklyData = [
    { day: 'Mon', xp: 120, tasks: 3 },
    { day: 'Tue', xp: 80, tasks: 2 },
    { day: 'Wed', xp: 200, tasks: 5 },
    { day: 'Thu', xp: 150, tasks: 4 },
    { day: 'Fri', xp: 90, tasks: 2 },
    { day: 'Sat', xp: 180, tasks: 4 },
    { day: 'Sun', xp: 110, tasks: 3 },
  ];

  const totalXpThisWeek = weeklyData.reduce((sum, day) => sum + day.xp, 0);
  const totalTasksThisWeek = weeklyData.reduce((sum, day) => sum + day.tasks, 0);
  const avgXpPerDay = Math.round(totalXpThisWeek / 7);

  const stats = [
    {
      title: 'Total XP',
      value: totalXpThisWeek,
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      change: '+15%',
    },
    {
      title: 'Tasks Done',
      value: totalTasksThisWeek,
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      change: '+8%',
    },
    {
      title: 'Avg XP/Day',
      value: avgXpPerDay,
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-500',
      change: '+12%',
    },
    {
      title: 'Active Days',
      value: 6,
      icon: Clock,
      color: 'from-purple-400 to-pink-500',
      change: '+2',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Weekly Report
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-green-500 font-medium">{stat.change}</span>
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.title}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis 
              dataKey="day" 
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
            <Bar 
              dataKey="xp" 
              fill="url(#xpGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}