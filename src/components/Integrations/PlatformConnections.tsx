import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Code, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Settings,
  TrendingUp,
  Star,
  GitBranch,
  Users,
  Award
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { IntegrationService } from '../../services/integrationService';
import { GitHubStats, PlatformStats } from '../../types';

export function PlatformConnections() {
  const { state, dispatch } = useApp();
  const { user: authUser } = useAuth();
  const { darkMode, user } = state;
  
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernames, setUsernames] = useState({
    github: user?.githubUsername || '',
    leetcode: user?.leetcodeUsername || '',
    geeksforgeeks: user?.geeksforgeeksUsername || '',
    codechef: user?.codechefUsername || '',
  });

  const platforms = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'from-gray-700 to-gray-900',
      description: 'Connect your GitHub to track repositories, commits, and contributions',
      connected: !!user?.githubUsername,
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Code,
      color: 'from-orange-500 to-red-600',
      description: 'Sync your LeetCode progress and contest ratings',
      connected: !!user?.leetcodeUsername,
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      icon: Code,
      color: 'from-green-500 to-emerald-600',
      description: 'Import your GeeksforGeeks coding scores and rankings',
      connected: !!user?.geeksforgeeksUsername,
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      icon: Award,
      color: 'from-blue-500 to-cyan-600',
      description: 'Track your CodeChef ratings and contest performance',
      connected: !!user?.codechefUsername,
    },
  ];

  useEffect(() => {
    if (user?.githubUsername || user?.leetcodeUsername) {
      loadExistingStats();
    }
  }, [user]);

  const loadExistingStats = async () => {
    if (!authUser) return;
    
    setLoading(true);
    try {
      // Load from database first
      const { data: githubData } = await supabase
        .from('github_stats')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (githubData) {
        setGithubStats({
          username: githubData.username,
          publicRepos: githubData.public_repos,
          followers: githubData.followers,
          following: githubData.following,
          totalStars: githubData.total_stars,
          totalForks: githubData.total_forks,
          totalCommits: githubData.total_commits,
          contributionStreak: githubData.contribution_streak,
          languageStats: githubData.language_stats,
          topRepositories: githubData.top_repositories,
          contributionGraph: [],
          lastUpdated: new Date(githubData.last_updated),
        });
      }

      // Load platform stats
      const { data: platformData } = await supabase
        .from('platform_stats')
        .select('*')
        .eq('user_id', authUser.id);

      if (platformData && platformData.length > 0) {
        const stats: any = {
          leetcode: null,
          geeksforgeeks: null,
          codechef: null,
        };

        platformData.forEach(platform => {
          if (platform.platform === 'leetcode') {
            stats.leetcode = {
              totalSolved: platform.total_solved,
              ranking: platform.ranking,
              acceptanceRate: platform.acceptance_rate,
              easyCount: platform.easy_count,
              mediumCount: platform.medium_count,
              hardCount: platform.hard_count,
              contestRating: platform.contest_rating,
              badges: platform.badges || [],
            };
          }
          // Similar for other platforms...
        });

        setPlatformStats(stats);
      }
    } catch (error) {
      console.error('Error loading existing stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncPlatform = async (platformId: string) => {
    if (!authUser || !usernames[platformId as keyof typeof usernames]) return;
    
    setSyncing(platformId);
    try {
      const username = usernames[platformId as keyof typeof usernames];
      
      if (platformId === 'github') {
        const stats = await IntegrationService.fetchGitHubStats(username);
        if (stats) {
          setGithubStats(stats);
          
          // Update user profile with GitHub username
          await supabase
            .from('profiles')
            .update({ github_username: username })
            .eq('user_id', authUser.id);

          dispatch({ type: 'ADD_NOTIFICATION', payload: {
            id: Date.now().toString(),
            type: 'integration',
            title: 'GitHub Connected! 🎉',
            message: `Successfully synced ${stats.totalCommits} commits and ${stats.publicRepos} repositories.`,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
          }});
        }
      } else if (platformId === 'leetcode') {
        const stats = await IntegrationService.fetchLeetCodeStats(username);
        if (stats) {
          setPlatformStats(prev => ({ ...prev, leetcode: stats }));
          
          await supabase
            .from('profiles')
            .update({ leetcode_username: username })
            .eq('user_id', authUser.id);

          dispatch({ type: 'ADD_NOTIFICATION', payload: {
            id: Date.now().toString(),
            type: 'integration',
            title: 'LeetCode Connected! 🚀',
            message: `Synced ${stats.totalSolved} problems solved with ${stats.acceptanceRate}% acceptance rate.`,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
          }});
        }
      }
      // Similar for other platforms...

    } catch (error) {
      console.error(`Error syncing ${platformId}:`, error);
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'integration',
        title: 'Sync Failed',
        message: `Failed to sync ${platformId}. Please check your username and try again.`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
      }});
    } finally {
      setSyncing(null);
    }
  };

  const syncAllPlatforms = async () => {
    if (!authUser) return;
    
    setLoading(true);
    try {
      const results = await IntegrationService.syncAllPlatforms(authUser.id, usernames);
      
      if (results.github) setGithubStats(results.github);
      if (results.platformStats) setPlatformStats(results.platformStats as PlatformStats);

      const successCount = Object.values(results.platformStats).filter(Boolean).length + (results.github ? 1 : 0);
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'integration',
        title: 'Sync Complete! ✨',
        message: `Successfully synced ${successCount} platform${successCount !== 1 ? 's' : ''}. ${results.errors.length > 0 ? `${results.errors.length} failed.` : ''}`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
      }});

    } catch (error) {
      console.error('Error syncing all platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Platform Integrations 🔗
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect your coding platforms to automatically track your progress and showcase your skills
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUsernameModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center space-x-2"
          >
            <Settings size={20} />
            <span>Configure Usernames</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={syncAllPlatforms}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Syncing...' : 'Sync All'}</span>
          </motion.button>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            const isConnected = platform.connected;
            const isSyncing = syncing === platform.id;
            
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg border-2 ${
                  isConnected ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {platform.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {isConnected ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500 font-medium">Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Not connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => syncPlatform(platform.id)}
                    disabled={isSyncing || !usernames[platform.id as keyof typeof usernames]}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      isConnected
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                  </motion.button>
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {platform.description}
                </p>

                {/* Platform-specific stats */}
                {platform.id === 'github' && githubStats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <GitBranch className="h-4 w-4 text-blue-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.publicRepos}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Repositories
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.totalStars}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Stars
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.followers}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Followers
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {githubStats.contributionStreak}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Day Streak
                      </div>
                    </div>
                  </div>
                )}

                {platform.id === 'leetcode' && platformStats?.leetcode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {platformStats.leetcode.totalSolved}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Problems Solved
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          #{platformStats.leetcode.ranking.toLocaleString()}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Global Rank
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {platformStats.leetcode.acceptanceRate}%
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Acceptance Rate
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="h-4 w-4 text-orange-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {platformStats.leetcode.badges.length}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Badges
                      </div>
                    </div>
                  </div>
                )}

                {!isConnected && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Connect this platform to unlock detailed analytics and automated progress tracking.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* GitHub Detailed Stats */}
        {githubStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GitHub Analytics
            </h2>

            {/* Top Repositories */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Repositories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {githubStats.topRepositories.map((repo, index) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                        {repo.name}
                      </h4>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                    </div>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {repo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {repo.language}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {repo.stars}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-3 w-3 text-blue-500" />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {repo.forks}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Language Distribution */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Language Distribution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(githubStats.languageStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([language, count]) => (
                    <div
                      key={language}
                      className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}
                    >
                      <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {count}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* LeetCode Detailed Stats */}
        {platformStats?.leetcode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              LeetCode Performance
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.totalSolved}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Solved
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  #{platformStats.leetcode.ranking.toLocaleString()}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Global Rank
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.acceptanceRate}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Acceptance Rate
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.badges.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Badges
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-green-500`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.easyCount}
                </div>
                <div className="text-sm text-green-500 font-medium">Easy Problems</div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-yellow-500`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.mediumCount}
                </div>
                <div className="text-sm text-yellow-500 font-medium">Medium Problems</div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-red-500`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {platformStats.leetcode.hardCount}
                </div>
                <div className="text-sm text-red-500 font-medium">Hard Problems</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Username Configuration Modal */}
        <AnimatePresence>
          {showUsernameModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUsernameModal(false)}
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
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configure Platform Usernames
                </h3>
                
                <div className="space-y-4">
                  {platforms.map(platform => (
                    <div key={platform.id}>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {platform.name} Username
                      </label>
                      <input
                        type="text"
                        value={usernames[platform.id as keyof typeof usernames]}
                        onChange={(e) => setUsernames(prev => ({
                          ...prev,
                          [platform.id]: e.target.value
                        }))}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                        placeholder={`Enter your ${platform.name} username`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUsernameModal(false)}
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
                    onClick={() => {
                      setShowUsernameModal(false);
                      // Save usernames to profile
                      if (authUser) {
                        supabase
                          .from('profiles')
                          .update({
                            github_username: usernames.github,
                            leetcode_username: usernames.leetcode,
                            geeksforgeeks_username: usernames.geeksforgeeks,
                            codechef_username: usernames.codechef,
                          })
                          .eq('user_id', authUser.id);
                      }
                    }}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600"
                  >
                    Save
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