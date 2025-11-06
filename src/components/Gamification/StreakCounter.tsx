import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function StreakCounter() {
  const { state } = useApp();
  const { user, darkMode } = state;

  if (!user) return null;

  const streakDays = user.streak;
  const maxDisplayDays = 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Streak
        </h3>
        <div className="flex items-center space-x-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {streakDays}
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        {[...Array(maxDisplayDays)].map((_, index) => {
          const dayNumber = index + 1;
          const isActive = dayNumber <= streakDays;
          const isCurrent = dayNumber === streakDays;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {dayNumber}
              </div>
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-orange-400 opacity-30"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {streakDays === 0
            ? 'Start your streak today!'
            : streakDays === 1
            ? 'Great start! Keep it going!'
            : `${streakDays} days strong! 🔥`}
        </p>
      </div>
    </motion.div>
  );
}