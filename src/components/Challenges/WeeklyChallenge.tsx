import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, Trophy, Star, CheckCircle, Play, Edit, Calendar, Users, Zap, Award, TrendingUp, Flag, Timer, BarChart3 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';

export function WeeklyChallenge() {
  const { state, dispatch } = useApp();
  const { user: authUser } = useAuth();
  const { darkMode, challenges } = state;
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);

  // Enhanced challenge management functions
  const startChallenge = async (challengeId: string) => {
    if (!authUser) return;

    try {
      dispatch({ type: 'START_CHALLENGE', payload: challengeId });
      
      // Add XP for starting challenge
      dispatch({ type: 'ADD_XP', payload: { amount: 25, source: 'Challenge Started' } });
      
      // Add notification
      const challenge = challenges.find(c => c.id === challengeId);
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'challenge',
        title: 'Challenge Started! 🚀',
        message: `You've started "${challenge?.title}". Good luck!`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
      }});

      // Update social stats
      dispatch({ type: 'UPDATE_SOCIAL_STATS', payload: { 
        profileViews: state.socialStats.profileViews + Math.floor(Math.random() * 3) + 1 
      }});

    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const resumeChallenge = async (challengeId: string) => {
    if (!authUser) return;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Simulate progress update
    const progressIncrement = Math.floor(Math.random() * 3) + 1;
    const newProgress = Math.min(challenge.progress + progressIncrement, challenge.maxProgress);
    
    const updatedChallenge = {
      ...challenge,
      progress: newProgress,
      status: newProgress >= challenge.maxProgress ? 'completed' : 'in-progress'
    };

    dispatch({ type: 'UPDATE_CHALLENGE', payload: updatedChallenge });

    // Add XP for progress
    const xpGained = progressIncrement * 10;
    dispatch({ type: 'ADD_XP', payload: { amount: xpGained, source: 'Challenge Progress' } });

    // Check for completion
    if (newProgress >= challenge.maxProgress) {
      dispatch({ type: 'ADD_XP', payload: { amount: challenge.xpReward, source: 'Challenge Completed' } });
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'achievement',
        title: 'Challenge Completed! 🎉',
        message: `Congratulations! You completed "${challenge.title}" and earned ${challenge.xpReward} XP!`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
      }});

      // Random reward chance
      if (Math.random() < 0.3) {
        const rewards = [
          '🎁 Bonus XP Multiplier x2 for 1 hour!',
          '🌟 Special Theme Unlocked!',
          '💎 Rare Badge Unlocked!',
          '🔥 Streak Booster Activated!',
        ];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: {
          id: (Date.now() + 1).toString(),
          type: 'reward',
          title: 'Bonus Reward! 🎰',
          message: reward,
          timestamp: new Date(),
          read: false,
          priority: 'high',
        }});

        if (reward.includes('Multiplier')) {
          dispatch({ type: 'ACTIVATE_BONUS_XP', payload: { multiplier: 2, duration: 1 } });
        }
      }
    } else {
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'challenge',
        title: 'Progress Made! 📈',
        message: `You made progress on "${challenge.title}". Keep going!`,
        timestamp: new Date(),
        read: false,
        priority: 'low',
      }});
    }
  };

  const updateMilestoneProgress = (challengeId: string, milestoneId: string, newProgress: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const updatedMilestones = challenge.milestones.map((milestone: any) => {
      if (milestone.id === milestoneId) {
        const completed = newProgress >= milestone.target;
        if (completed && !milestone.completed) {
          // Milestone just completed
          dispatch({ type: 'ADD_XP', payload: { amount: milestone.xpReward, source: 'Milestone Completed' } });
          
          dispatch({ type: 'ADD_NOTIFICATION', payload: {
            id: Date.now().toString(),
            type: 'achievement',
            title: 'Milestone Achieved! 🎯',
            message: `You completed "${milestone.title}" and earned ${milestone.xpReward} XP!`,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
          }});
        }
        return { ...milestone, progress: newProgress, completed };
      }
      return milestone;
    });

    const totalProgress = updatedMilestones.reduce((sum: number, m: any) => sum + (m.completed ? 1 : 0), 0);
    const updatedChallenge = {
      ...challenge,
      milestones: updatedMilestones,
      progress: totalProgress,
      status: totalProgress >= challenge.maxProgress ? 'completed' : challenge.status
    };

    dispatch({ type: 'UPDATE_CHALLENGE', payload: updatedChallenge });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-emerald-500';
      case 'Medium': return 'from-yellow-400 to-orange-500';
      case 'Hard': return 'from-red-400 to-pink-500';
      case 'Elite': return 'from-purple-500 to-indigo-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Play className="h-5 w-5 text-blue-500" />;
      case 'not-started': return <Target className="h-5 w-5 text-gray-400" />;
      default: return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTimeRemaining = (timeLimit: string) => {
    // Simple time calculation for demo
    const days = parseInt(timeLimit.split(' ')[0]);
    return `${days - Math.floor(Math.random() * 3)} days left`;
  };

  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  const inProgressChallenges = challenges.filter(c => c.status === 'in-progress').length;
  const totalXPFromChallenges = challenges
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Challenge Arena 🏆
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Take on epic challenges to boost your skills and earn massive XP rewards
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              >
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {completedChallenges}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completed
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-500`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {completedChallenges}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-blue-500`}
          >
            <div className="flex items-center space-x-3">
              <Play className="h-8 w-8 text-blue-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {inProgressChallenges}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  In Progress
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-yellow-500`}
          >
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalXPFromChallenges.toLocaleString()}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total XP
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-purple-500`}
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(Math.random() * 5) + 1}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Days Left
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-orange-500`}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor((completedChallenges / challenges.length) * 100)}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Success Rate
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-red-500`}
          >
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-red-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  #{Math.floor(Math.random() * 100) + 1}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Global Rank
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg cursor-pointer border-2 ${
                selectedChallenge?.id === challenge.id
                  ? 'border-purple-500'
                  : 'border-transparent hover:border-purple-300'
              } transition-all duration-300`}
              onClick={() => setSelectedChallenge(challenge)}
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(challenge.status)}
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white`}>
                        {challenge.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.xpReward.toLocaleString()}
                    </span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    XP Reward
                  </div>
                </div>
              </div>

              {/* Challenge Description */}
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {challenge.description}
              </p>

              {/* Enhanced Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Overall Progress
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {challenge.progress}/{challenge.maxProgress}
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)}`}
                  />
                </div>
              </div>

              {/* Milestones Preview */}
              {challenge.milestones && challenge.milestones.length > 0 && (
                <div className="mb-4">
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Milestones ({challenge.milestones.filter((m: any) => m.completed).length}/{challenge.milestones.length})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {challenge.milestones.slice(0, 4).map((milestone: any, idx: number) => (
                      <div
                        key={milestone.id}
                        className={`p-2 rounded-lg text-xs ${
                          milestone.completed
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {milestone.completed ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-current" />
                          )}
                          <span className="truncate">{milestone.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time and Action Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getTimeRemaining(challenge.timeLimit)}
                    </span>
                  </div>
                  
                  {challenge.status === 'in-progress' && (
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-400">
                        Active
                      </span>
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (challenge.status === 'not-started') {
                      startChallenge(challenge.id);
                    } else if (challenge.status === 'in-progress') {
                      resumeChallenge(challenge.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    challenge.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default'
                      : challenge.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={challenge.status === 'completed'}
                >
                  {challenge.status === 'completed' ? (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  ) : challenge.status === 'in-progress' ? (
                    <div className="flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>Continue</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Flag className="h-4 w-4" />
                      <span>Start Challenge</span>
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Rewards Preview */}
              {challenge.rewards && challenge.rewards.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Rewards:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {challenge.rewards.slice(0, 3).map((reward: string, idx: number) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Challenge Details Modal */}
        <AnimatePresence>
          {selectedChallenge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedChallenge(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChallenge.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor(selectedChallenge.difficulty)} text-white`}>
                        {selectedChallenge.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedChallenge.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedChallenge.xpReward.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className={`p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors`}
                  >
                    ✕
                  </button>
                </div>

                {/* Challenge Description */}
                <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedChallenge.description}
                </p>

                {/* Challenge Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Time Limit
                    </div>
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChallenge.timeLimit}
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Progress
                    </div>
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChallenge.progress}/{selectedChallenge.maxProgress}
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Status
                    </div>
                    <div className={`font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChallenge.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>

                {/* Enhanced Milestones Section */}
                {selectedChallenge.milestones && selectedChallenge.milestones.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Milestones ({selectedChallenge.milestones.filter((m: any) => m.completed).length}/{selectedChallenge.milestones.length})
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Progress</span>
                      </motion.button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedChallenge.milestones.map((milestone: any, index: number) => (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border-2 ${
                            milestone.completed
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : darkMode
                              ? 'border-gray-700 bg-gray-700'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {milestone.completed ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-gray-400" />
                              )}
                              <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {milestone.title}
                              </h5>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {milestone.xpReward} XP
                              </span>
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {milestone.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Progress
                                </span>
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  {milestone.progress}/{milestone.target}
                                </span>
                              </div>
                              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  style={{ width: `${Math.min((milestone.progress / milestone.target) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            
                            {!milestone.completed && selectedChallenge.status === 'in-progress' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditingMilestone(milestone);
                                  setShowEditModal(true);
                                }}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                              >
                                Update
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements and Rewards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selectedChallenge.requirements && selectedChallenge.requirements.length > 0 && (
                    <div>
                      <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {selectedChallenge.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {req}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedChallenge.rewards && selectedChallenge.rewards.length > 0 && (
                    <div>
                      <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Rewards
                      </h4>
                      <ul className="space-y-2">
                        {selectedChallenge.rewards.map((reward: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {reward}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChallenge(null)}
                    className={`flex-1 py-3 px-4 rounded-lg border ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Close
                  </motion.button>
                  
                  {selectedChallenge.status !== 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (selectedChallenge.status === 'not-started') {
                          startChallenge(selectedChallenge.id);
                        } else {
                          resumeChallenge(selectedChallenge.id);
                        }
                        setSelectedChallenge(null);
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 font-medium"
                    >
                      {selectedChallenge.status === 'not-started' ? 'Start Challenge' : 'Continue Challenge'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Progress Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
              onClick={() => {
                setShowEditModal(false);
                setEditingMilestone(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`max-w-md w-full p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingMilestone ? 'Update Milestone Progress' : 'Update Challenge Progress'}
                </h3>
                
                {editingMilestone ? (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {editingMilestone.title}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={editingMilestone.target}
                        value={editingMilestone.progress}
                        onChange={(e) => {
                          const newProgress = parseInt(e.target.value);
                          setEditingMilestone({ ...editingMilestone, progress: newProgress });
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span>0</span>
                        <span>{editingMilestone.progress}/{editingMilestone.target}</span>
                        <span>{editingMilestone.target}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingMilestone(null);
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg border ${
                          darkMode
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateMilestoneProgress(selectedChallenge.id, editingMilestone.id, editingMilestone.progress);
                          setShowEditModal(false);
                          setEditingMilestone(null);
                        }}
                        className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Simulate progress on this challenge by updating milestones individually.
                    </p>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}