import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Star, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface QuestNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  xp: number;
  dependencies: string[];
  category: 'knowledge' | 'mindset' | 'communication' | 'portfolio';
}

export function CareerRoadmap() {
  const { state } = useApp();
  const { darkMode } = state;

  const [selectedQuest, setSelectedQuest] = useState<QuestNode | null>(null);

  const questNodes: QuestNode[] = [
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      description: 'Complete your career profile with goals and interests',
      status: 'completed',
      xp: 100,
      dependencies: [],
      category: 'portfolio',
    },
    {
      id: 'resume-creation',
      title: 'Resume Creation',
      description: 'Build a professional resume tailored to your target role',
      status: 'available',
      xp: 200,
      dependencies: ['profile-setup'],
      category: 'portfolio',
    },
    {
      id: 'linkedin-optimization',
      title: 'LinkedIn Optimization',
      description: 'Optimize your LinkedIn profile for maximum visibility',
      status: 'available',
      xp: 150,
      dependencies: ['profile-setup'],
      category: 'communication',
    },
    {
      id: 'github-portfolio',
      title: 'GitHub Portfolio',
      description: 'Showcase your best projects on GitHub',
      status: 'locked',
      xp: 200,
      dependencies: ['resume-creation'],
      category: 'portfolio',
    },
    {
      id: 'dsa-mastery',
      title: 'DSA Mastery',
      description: 'Master data structures and algorithms',
      status: 'locked',
      xp: 500,
      dependencies: ['github-portfolio'],
      category: 'knowledge',
    },
    {
      id: 'mock-interviews',
      title: 'Mock Interviews',
      description: 'Practice technical and behavioral interviews',
      status: 'locked',
      xp: 300,
      dependencies: ['linkedin-optimization', 'dsa-mastery'],
      category: 'communication',
    },
    {
      id: 'internship-applications',
      title: 'Internship Applications',
      description: 'Apply to your target companies',
      status: 'locked',
      xp: 400,
      dependencies: ['mock-interviews'],
      category: 'mindset',
    },
  ];

  const getStatusIcon = (status: QuestNode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-6 w-6 text-blue-500" />;
      case 'available':
        return <Circle className="h-6 w-6 text-yellow-500" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: QuestNode['category']) => {
    switch (category) {
      case 'knowledge':
        return 'from-blue-500 to-cyan-500';
      case 'mindset':
        return 'from-purple-500 to-pink-500';
      case 'communication':
        return 'from-green-500 to-emerald-500';
      case 'portfolio':
        return 'from-orange-500 to-red-500';
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Career Questline
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Follow your personalized roadmap to career success
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roadmap */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {questNodes.map((node, index) => {
                  if (index === questNodes.length - 1) return null;
                  const nextNode = questNodes[index + 1];
                  return (
                    <motion.line
                      key={`${node.id}-${nextNode.id}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      x1="50%"
                      y1={`${((index + 1) * 120) - 40}px`}
                      x2="50%"
                      y2={`${((index + 2) * 120) - 80}px`}
                      stroke={darkMode ? '#374151' : '#E5E7EB'}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                })}
              </svg>

              {/* Quest Nodes */}
              <div className="space-y-8 relative" style={{ zIndex: 1 }}>
                {questNodes.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor(quest.category)} flex items-center justify-center cursor-pointer`}
                        onClick={() => setSelectedQuest(quest)}
                      >
                        {getStatusIcon(quest.status)}
                      </motion.div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex-1 p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow-lg cursor-pointer border-2 ${
                        selectedQuest?.id === quest.id
                          ? 'border-purple-500'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedQuest(quest)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {quest.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {quest.xp} XP
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {quest.description}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {quest.category}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Quest Details */}
          <div className="lg:col-span-1">
            {selectedQuest ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg sticky top-6`}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedQuest.title}
                </h3>
                
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedQuest.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status
                    </span>
                    <span className={`text-sm font-medium capitalize ${
                      selectedQuest.status === 'completed' ? 'text-green-500' :
                      selectedQuest.status === 'available' ? 'text-yellow-500' :
                      selectedQuest.status === 'in-progress' ? 'text-blue-500' :
                      'text-gray-400'
                    }`}>
                      {selectedQuest.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      XP Reward
                    </span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedQuest.xp} XP
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Category
                    </span>
                    <span className={`text-sm font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedQuest.category}
                    </span>
                  </div>
                </div>

                {selectedQuest.dependencies.length > 0 && (
                  <div className="mb-6">
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dependencies
                    </h4>
                    <div className="space-y-1">
                      {selectedQuest.dependencies.map(dep => {
                        const depQuest = questNodes.find(q => q.id === dep);
                        return (
                          <div key={dep} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {depQuest?.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={selectedQuest.status === 'locked' || selectedQuest.status === 'completed'}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                    selectedQuest.status === 'available'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                      : selectedQuest.status === 'in-progress'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {selectedQuest.status === 'completed' ? 'Completed' :
                     selectedQuest.status === 'in-progress' ? 'Continue Quest' :
                     selectedQuest.status === 'available' ? 'Start Quest' :
                     'Locked'}
                  </span>
                  {selectedQuest.status !== 'locked' && selectedQuest.status !== 'completed' && (
                    <ArrowRight size={16} />
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg text-center`}>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a quest to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}