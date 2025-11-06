import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, Target, Zap, Calendar, Trophy, Flame } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { taskService } from '../../services/taskService';
import { TaskCard } from './TaskCard';
import { Task } from '../../types';

export function TaskBoard() {
  const { state, dispatch } = useApp();
  const { user: authUser } = useAuth();
  const { tasks, darkMode, user } = state;
  const [filter, setFilter] = useState<'all' | 'Elite' | 'Core' | 'Bonus'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Core' as 'Elite' | 'Core' | 'Bonus',
    category: '',
    xp: 100,
  });

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.priority === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const eliteTasks = filteredTasks.filter(task => task.priority === 'Elite');
  const coreTasks = filteredTasks.filter(task => task.priority === 'Core');
  const bonusTasks = filteredTasks.filter(task => task.priority === 'Bonus');

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const todayCompleted = completedTasks.filter(task => {
    const today = new Date().toDateString();
    return task.createdAt.toDateString() === today;
  });

  const addCustomTask = async () => {
    if (!authUser || !newTask.title.trim()) return;

    try {
      const taskData: Omit<Task, 'id'> = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        completed: false,
        xp: newTask.xp,
        category: newTask.category || 'General',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      };

      await taskService.createTask(authUser.id, taskData);
      
      const task: Task = {
        ...taskData,
        id: Date.now().toString(),
      };

      dispatch({ type: 'ADD_TASK', payload: task });
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'Core',
        category: '',
        xp: 100,
      });
      setShowAddTask(false);

      // Add notification
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'task-created',
        title: 'Task Created! 📝',
        message: `"${task.title}" has been added to your task board.`,
        timestamp: new Date(),
      }});

    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const addSampleTask = async () => {
    if (!authUser) return;

    const sampleTasks: Omit<Task, 'id'>[] = [
      {
        title: 'Solve Binary Tree Maximum Path Sum',
        description: 'Hard LeetCode problem - practice tree algorithms',
        priority: 'Elite',
        completed: false,
        xp: 200,
        category: 'DSA',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      },
      {
        title: 'Complete System Design Course Module',
        description: 'Learn about scalable system architecture',
        priority: 'Core',
        completed: false,
        xp: 150,
        category: 'Learning',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      },
      {
        title: 'Update GitHub Profile README',
        description: 'Showcase your skills and projects',
        priority: 'Bonus',
        completed: false,
        xp: 75,
        category: 'Profile',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      },
      {
        title: 'Practice Mock Interview Questions',
        description: 'Prepare for behavioral and technical rounds',
        priority: 'Elite',
        completed: false,
        xp: 175,
        category: 'Interview',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      },
      {
        title: 'Build React Component Library',
        description: 'Create reusable components for portfolio',
        priority: 'Core',
        completed: false,
        xp: 250,
        category: 'Portfolio',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        streak: 0,
      },
    ];

    const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
    
    try {
      await taskService.createTask(authUser.id, randomTask);
      
      const newTask: Task = {
        ...randomTask,
        id: Date.now().toString(),
      };

      dispatch({ type: 'ADD_TASK', payload: newTask });

      // Add notification
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'task-created',
        title: 'Task Added! 🎯',
        message: `"${newTask.title}" is ready for you to tackle!`,
        timestamp: new Date(),
      }});

    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const priorityColors = {
    Elite: 'from-red-500 to-pink-500',
    Core: 'from-blue-500 to-cyan-500',
    Bonus: 'from-green-500 to-emerald-500',
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Task Board 🎯
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Organize your tasks by priority and track your progress
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-blue-500`}
          >
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {pendingTasks.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Tasks
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-500`}
          >
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-green-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {completedTasks.length}
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
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-yellow-500`}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-yellow-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {todayCompleted.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Today
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-orange-500`}
          >
            <div className="flex items-center space-x-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.streak || 0}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Day Streak
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={`px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              <option value="all">All Tasks</option>
              <option value="Elite">Elite</option>
              <option value="Core">Core</option>
              <option value="Bonus">Bonus</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddTask(true)}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Custom Task</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSampleTask}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center space-x-2"
            >
              <Zap size={20} />
              <span>Quick Add</span>
            </motion.button>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elite Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Elite ({eliteTasks.length})
                </h2>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                High Impact
              </div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {eliteTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Core Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Core ({coreTasks.length})
                </h2>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Essential
              </div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {coreTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bonus Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bonus ({bonusTasks.length})
                </h2>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Extra Credit
              </div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {bonusTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddTask(false)}
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
                  Create Custom Task
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                      placeholder="Enter task title"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                      placeholder="Describe your task"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                      >
                        <option value="Elite">Elite</option>
                        <option value="Core">Core</option>
                        <option value="Bonus">Bonus</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        XP Reward
                      </label>
                      <input
                        type="number"
                        value={newTask.xp}
                        onChange={(e) => setNewTask(prev => ({ ...prev, xp: parseInt(e.target.value) || 100 }))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                        min="25"
                        max="500"
                        step="25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                      placeholder="e.g., DSA, Learning, Portfolio"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddTask(false)}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addCustomTask}
                    disabled={!newTask.title.trim()}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Task
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}