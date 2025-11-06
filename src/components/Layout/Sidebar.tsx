import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Target,
  CheckSquare,
  BarChart3, 
  Link,
  Trophy,
  User,
  BookOpen,
  Users,
  Zap,
  Calendar,
  TrendingUp,
  Award,
  Code,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { state } = useApp();
  const { darkMode } = state;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'coding', label: 'Coding Arena', icon: Code },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'questline', label: 'Career Quest', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Calendar },
    { id: 'skills', label: 'Skill Tree', icon: BookOpen },
    { id: 'challenges', label: 'Challenges', icon: Zap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`w-64 h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } border-r ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } flex flex-col overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Navigation
        </h2>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}