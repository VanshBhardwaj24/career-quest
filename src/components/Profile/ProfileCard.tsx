import React from 'react';
import { motion } from 'framer-motion';
import { Edit, MapPin, Calendar, Trophy, Zap, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function ProfileCard() {
  const { state } = useApp();
  const { user, darkMode } = state;

  if (!user) return null;

  const getTierGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'mythic':
        return 'from-red-500 to-pink-500';
      case 'platinum':
        return 'from-purple-500 to-indigo-500';
      case 'gold':
        return 'from-yellow-400 to-orange-500';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'bronze':
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const nextLevelXp = user.level * 1000;
  const currentLevelXp = (user.level - 1) * 1000;
  const progressXp = user.xp - currentLevelXp;
  const neededXp = nextLevelXp - currentLevelXp;
  const progressPercentage = (progressXp / neededXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getTierGradient(user.tier)} flex items-center justify-center text-white font-bold text-xl relative`}>
            {user.name.charAt(0)}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full"
            />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {user.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierGradient(user.tier)} text-white`}>
                {user.tier}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Level {user.level}
              </span>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Edit size={16} />
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {user.xp.toLocaleString()}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total XP
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {user.streak}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Day Streak
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {user.level}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Level
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Level {user.level} Progress
          </span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {progressXp}/{neededXp} XP
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full bg-gradient-to-r ${getTierGradient(user.tier)}`}
          />
        </div>
      </div>

      {/* Education & Career Info */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <MapPin className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {user.degree} in {user.branch}, {user.year}th Year
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Target className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {user.careerGoal}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Joined {new Date(user.lastActivity).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-4">
        <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Interests
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.interests.slice(0, 3).map((interest, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {interest}
            </span>
          ))}
          {user.interests.length > 3 && (
            <span className={`px-2 py-1 rounded-full text-xs ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              +{user.interests.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}