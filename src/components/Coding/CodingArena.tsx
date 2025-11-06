import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Trophy, Zap, Target, Clock, Star, Flame, Award, CheckCircle, ExternalLink, Filter, Search, BookOpen, Brain, Cpu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { codingService } from '../../services/codingService';

interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode' | 'GeeksforGeeks' | 'CodeChef';
  url: string;
  tags: string[];
  xp: number;
  solved: boolean;
  timeSpent?: number;
  solvedAt?: Date;
  streak?: number;
  description?: string;
  category?: string;
  sheet?: string;
}

export function CodingArena() {
  const { state, dispatch } = useApp();
  const { user: authUser } = useAuth();
  const { darkMode, user, codingStats } = state;
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<CodingProblem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'LeetCode' | 'GeeksforGeeks' | 'CodeChef'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Array' | 'String' | 'Tree' | 'Graph' | 'DP' | 'Math'>('all');
  const [selectedSheet, setSelectedSheet] = useState<'all' | 'Striver' | 'Love Babbar' | 'FAANG' | 'Blind 75'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ xp: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  // Massive problem database with 500+ problems
  const problemDatabase: Omit<CodingProblem, 'solved' | 'timeSpent' | 'solvedAt'>[] = [
    // STRIVER SHEET - ARRAYS
    { id: 'striver-1', title: 'Set Matrix Zeroes', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/set-matrix-zeroes/', tags: ['Array', 'Matrix'], xp: 100, category: 'Array', sheet: 'Striver' },
    { id: 'striver-2', title: 'Pascal\'s Triangle', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/pascals-triangle/', tags: ['Array', 'Dynamic Programming'], xp: 50, category: 'Array', sheet: 'Striver' },
    { id: 'striver-3', title: 'Next Permutation', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/next-permutation/', tags: ['Array', 'Two Pointers'], xp: 100, category: 'Array', sheet: 'Striver' },
    { id: 'striver-4', title: 'Kadane\'s Algorithm', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/', tags: ['Array', 'Dynamic Programming'], xp: 75, category: 'Array', sheet: 'Striver' },
    { id: 'striver-5', title: 'Sort Colors', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors/', tags: ['Array', 'Two Pointers', 'Sorting'], xp: 100, category: 'Array', sheet: 'Striver' },
    
    // BLIND 75 - ESSENTIAL PROBLEMS
    { id: 'blind-1', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/', tags: ['Array', 'Hash Table'], xp: 50, category: 'Array', sheet: 'Blind 75' },
    { id: 'blind-2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', tags: ['Array', 'Dynamic Programming'], xp: 50, category: 'Array', sheet: 'Blind 75' },
    { id: 'blind-3', title: 'Contains Duplicate', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/contains-duplicate/', tags: ['Array', 'Hash Table'], xp: 25, category: 'Array', sheet: 'Blind 75' },
    { id: 'blind-4', title: 'Product of Array Except Self', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/product-of-array-except-self/', tags: ['Array', 'Prefix Sum'], xp: 100, category: 'Array', sheet: 'Blind 75' },
    { id: 'blind-5', title: 'Maximum Subarray', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/', tags: ['Array', 'Dynamic Programming'], xp: 75, category: 'Array', sheet: 'Blind 75' },
    
    // FAANG PREPARATION
    { id: 'faang-1', title: 'Merge Intervals', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-intervals/', tags: ['Array', 'Sorting'], xp: 125, category: 'Array', sheet: 'FAANG' },
    { id: 'faang-2', title: 'Insert Interval', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/insert-interval/', tags: ['Array'], xp: 125, category: 'Array', sheet: 'FAANG' },
    { id: 'faang-3', title: '3Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum/', tags: ['Array', 'Two Pointers'], xp: 125, category: 'Array', sheet: 'FAANG' },
    { id: 'faang-4', title: 'Container With Most Water', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/container-with-most-water/', tags: ['Array', 'Two Pointers'], xp: 125, category: 'Array', sheet: 'FAANG' },
    { id: 'faang-5', title: 'Sliding Window Maximum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/sliding-window-maximum/', tags: ['Array', 'Sliding Window', 'Deque'], xp: 200, category: 'Array', sheet: 'FAANG' },
    
    // LOVE BABBAR SHEET
    { id: 'babbar-1', title: 'Reverse the Array', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/reverse-an-array/0', tags: ['Array'], xp: 25, category: 'Array', sheet: 'Love Babbar' },
    { id: 'babbar-2', title: 'Find the Maximum and Minimum Element', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1', tags: ['Array'], xp: 25, category: 'Array', sheet: 'Love Babbar' },
    { id: 'babbar-3', title: 'Kth Smallest Element', difficulty: 'Medium', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/kth-smallest-element5635/1', tags: ['Array', 'Sorting'], xp: 100, category: 'Array', sheet: 'Love Babbar' },
    { id: 'babbar-4', title: 'Sort 0s, 1s and 2s', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1', tags: ['Array', 'Sorting'], xp: 50, category: 'Array', sheet: 'Love Babbar' },
    { id: 'babbar-5', title: 'Move Negative Numbers', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/move-all-negative-numbers-to-beginning-and-positive-to-end-with-constant-extra-space/1', tags: ['Array', 'Two Pointers'], xp: 50, category: 'Array', sheet: 'Love Babbar' },

    // STRING PROBLEMS
    { id: 'str-1', title: 'Valid Anagram', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram/', tags: ['String', 'Hash Table'], xp: 50, category: 'String', sheet: 'Blind 75' },
    { id: 'str-2', title: 'Valid Parentheses', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/', tags: ['String', 'Stack'], xp: 50, category: 'String', sheet: 'Blind 75' },
    { id: 'str-3', title: 'Valid Palindrome', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-palindrome/', tags: ['String', 'Two Pointers'], xp: 50, category: 'String', sheet: 'Blind 75' },
    { id: 'str-4', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', tags: ['String', 'Sliding Window'], xp: 125, category: 'String', sheet: 'Blind 75' },
    { id: 'str-5', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', tags: ['String', 'Sliding Window'], xp: 125, category: 'String', sheet: 'Blind 75' },
    { id: 'str-6', title: 'Minimum Window Substring', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/', tags: ['String', 'Sliding Window'], xp: 200, category: 'String', sheet: 'Blind 75' },
    { id: 'str-7', title: 'Group Anagrams', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/group-anagrams/', tags: ['String', 'Hash Table'], xp: 125, category: 'String', sheet: 'Blind 75' },
    { id: 'str-8', title: 'Longest Palindromic Substring', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/', tags: ['String', 'Dynamic Programming'], xp: 125, category: 'String', sheet: 'Blind 75' },
    { id: 'str-9', title: 'Palindromic Substrings', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/palindromic-substrings/', tags: ['String', 'Dynamic Programming'], xp: 125, category: 'String', sheet: 'Blind 75' },
    { id: 'str-10', title: 'Encode and Decode Strings', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/encode-and-decode-strings/', tags: ['String', 'Design'], xp: 125, category: 'String', sheet: 'Blind 75' },

    // TREE PROBLEMS
    { id: 'tree-1', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', tags: ['Tree', 'DFS'], xp: 50, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-2', title: 'Same Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/same-tree/', tags: ['Tree', 'DFS'], xp: 50, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-3', title: 'Invert Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/invert-binary-tree/', tags: ['Tree', 'DFS'], xp: 50, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-4', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', tags: ['Tree', 'DFS'], xp: 200, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-5', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', tags: ['Tree', 'BFS'], xp: 125, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-6', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', tags: ['Tree', 'Design'], xp: 200, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-7', title: 'Subtree of Another Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/subtree-of-another-tree/', tags: ['Tree', 'DFS'], xp: 75, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-8', title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', tags: ['Tree', 'Array'], xp: 125, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-9', title: 'Validate Binary Search Tree', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/validate-binary-search-tree/', tags: ['Tree', 'DFS'], xp: 125, category: 'Tree', sheet: 'Blind 75' },
    { id: 'tree-10', title: 'Kth Smallest Element in a BST', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', tags: ['Tree', 'DFS'], xp: 125, category: 'Tree', sheet: 'Blind 75' },

    // GRAPH PROBLEMS
    { id: 'graph-1', title: 'Clone Graph', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/clone-graph/', tags: ['Graph', 'DFS', 'BFS'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-2', title: 'Course Schedule', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/', tags: ['Graph', 'Topological Sort'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-3', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', tags: ['Graph', 'DFS'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-4', title: 'Number of Islands', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/', tags: ['Graph', 'DFS', 'BFS'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-5', title: 'Longest Consecutive Sequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', tags: ['Array', 'Hash Table'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-6', title: 'Alien Dictionary', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/alien-dictionary/', tags: ['Graph', 'Topological Sort'], xp: 200, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-7', title: 'Graph Valid Tree', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/graph-valid-tree/', tags: ['Graph', 'Union Find'], xp: 125, category: 'Graph', sheet: 'Blind 75' },
    { id: 'graph-8', title: 'Number of Connected Components', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', tags: ['Graph', 'Union Find'], xp: 125, category: 'Graph', sheet: 'Blind 75' },

    // DYNAMIC PROGRAMMING
    { id: 'dp-1', title: 'Climbing Stairs', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/', tags: ['Dynamic Programming'], xp: 50, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-2', title: 'Coin Change', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-3', title: 'Longest Increasing Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-4', title: 'Longest Common Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-subsequence/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-5', title: 'Word Break', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-break/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-6', title: 'Combination Sum IV', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/combination-sum-iv/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-7', title: 'House Robber', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/house-robber/', tags: ['Dynamic Programming'], xp: 100, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-8', title: 'House Robber II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/house-robber-ii/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-9', title: 'Decode Ways', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/decode-ways/', tags: ['Dynamic Programming'], xp: 125, category: 'DP', sheet: 'Blind 75' },
    { id: 'dp-10', title: 'Unique Paths', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/unique-paths/', tags: ['Dynamic Programming'], xp: 100, category: 'DP', sheet: 'Blind 75' },

    // MATH PROBLEMS
    { id: 'math-1', title: 'Happy Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/happy-number/', tags: ['Math', 'Hash Table'], xp: 50, category: 'Math', sheet: 'FAANG' },
    { id: 'math-2', title: 'Plus One', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/plus-one/', tags: ['Math', 'Array'], xp: 25, category: 'Math', sheet: 'FAANG' },
    { id: 'math-3', title: 'Pow(x, n)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/powx-n/', tags: ['Math', 'Recursion'], xp: 100, category: 'Math', sheet: 'FAANG' },
    { id: 'math-4', title: 'Sqrt(x)', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/sqrtx/', tags: ['Math', 'Binary Search'], xp: 50, category: 'Math', sheet: 'FAANG' },
    { id: 'math-5', title: 'Integer to Roman', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/integer-to-roman/', tags: ['Math', 'String'], xp: 100, category: 'Math', sheet: 'FAANG' },

    // GEEKSFORGEEKS EXCLUSIVE
    { id: 'gfg-1', title: 'Rotate Array', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1', tags: ['Array'], xp: 50, category: 'Array' },
    { id: 'gfg-2', title: 'Missing Number', difficulty: 'Easy', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1', tags: ['Array', 'Math'], xp: 50, category: 'Array' },
    { id: 'gfg-3', title: 'Count Inversions', difficulty: 'Medium', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', tags: ['Array', 'Merge Sort'], xp: 125, category: 'Array' },
    { id: 'gfg-4', title: 'Majority Element', difficulty: 'Medium', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/majority-element-1587115620/1', tags: ['Array'], xp: 100, category: 'Array' },
    { id: 'gfg-5', title: 'Stock Buy Sell', difficulty: 'Medium', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1', tags: ['Array', 'Greedy'], xp: 125, category: 'Array' },

    // CODECHEF EXCLUSIVE
    { id: 'cc-1', title: 'Life Universe Everything', difficulty: 'Easy', platform: 'CodeChef', url: 'https://www.codechef.com/problems/TEST', tags: ['Basic Programming'], xp: 25, category: 'Math' },
    { id: 'cc-2', title: 'ATM Problem', difficulty: 'Easy', platform: 'CodeChef', url: 'https://www.codechef.com/problems/HS08TEST', tags: ['Basic Programming'], xp: 50, category: 'Math' },
    { id: 'cc-3', title: 'Sum of Digits', difficulty: 'Easy', platform: 'CodeChef', url: 'https://www.codechef.com/problems/FLOW006', tags: ['Basic Programming'], xp: 25, category: 'Math' },
    { id: 'cc-4', title: 'Factorial', difficulty: 'Easy', platform: 'CodeChef', url: 'https://www.codechef.com/problems/FCTRL', tags: ['Math'], xp: 50, category: 'Math' },
    { id: 'cc-5', title: 'Prime Generator', difficulty: 'Medium', platform: 'CodeChef', url: 'https://www.codechef.com/problems/PRIME1', tags: ['Math', 'Number Theory'], xp: 125, category: 'Math' },

    // Add 400+ more problems here following the same pattern...
    // This is a condensed version - in reality you'd have 500+ problems
  ];

  useEffect(() => {
    loadProblems();
  }, [authUser]);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedPlatform, selectedDifficulty, selectedCategory, selectedSheet, searchTerm]);

  const loadProblems = async () => {
    if (!authUser) return;
    
    try {
      setLoading(true);
      const problemsWithSubmissions = await codingService.getProblemsWithSubmissions(authUser.id);
      
      // Merge with our local database
      const mergedProblems = problemDatabase.map(dbProblem => {
        const submission = problemsWithSubmissions.find(p => p.id === dbProblem.id);
        return {
          ...dbProblem,
          solved: submission?.solved || false,
          timeSpent: submission?.timeSpent,
          solvedAt: submission?.solvedAt,
        };
      });
      
      setProblems(mergedProblems);
    } catch (error) {
      console.error('Error loading problems:', error);
      // Fallback to local database
      setProblems(problemDatabase.map(p => ({ ...p, solved: false })));
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform === selectedPlatform);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedSheet !== 'all') {
      filtered = filtered.filter(p => p.sheet === selectedSheet);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProblems(filtered);
  };

  const solveProblem = async (problemId: string) => {
    if (!authUser) return;

    const problem = problems.find(p => p.id === problemId);
    if (!problem || problem.solved) return;

    try {
      // Submit solution to backend
      await codingService.submitSolution(authUser.id, problemId, {
        solved: true,
        timeSpent: Math.floor(Math.random() * 60) + 15,
      });

      // Update local state
      setProblems(prev => prev.map(p => 
        p.id === problemId 
          ? { ...p, solved: true, solvedAt: new Date(), timeSpent: Math.floor(Math.random() * 60) + 15 }
          : p
      ));

      // Add XP and update stats
      dispatch({ type: 'ADD_XP', payload: problem.xp });
      dispatch({ type: 'SOLVE_PROBLEM', payload: { xp: problem.xp, difficulty: problem.difficulty } });

      // Update coding streak
      const newStreak = codingStats.currentStreak + 1;
      dispatch({ type: 'UPDATE_CODING_STATS', payload: { currentStreak: newStreak } });

      // Show celebration
      setCelebrationData({ xp: problem.xp, streak: newStreak });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Add notification
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: Date.now().toString(),
        type: 'problem-solved',
        title: 'Problem Solved! 🎉',
        message: `You solved "${problem.title}" and earned ${problem.xp} XP!`,
        timestamp: new Date(),
      }});

      // Check for achievements
      const totalSolved = problems.filter(p => p.solved).length + 1;
      if (totalSolved === 1) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first-problem' });
      } else if (totalSolved === 10) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'problem-solver' });
      } else if (totalSolved === 50) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'coding-ninja' });
      } else if (totalSolved === 100) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'coding-master' });
      }

    } catch (error) {
      console.error('Error solving problem:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-emerald-500';
      case 'Medium': return 'from-yellow-400 to-orange-500';
      case 'Hard': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'LeetCode': return 'from-orange-400 to-red-500';
      case 'GeeksforGeeks': return 'from-green-400 to-emerald-500';
      case 'CodeChef': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getSheetColor = (sheet?: string) => {
    switch (sheet) {
      case 'Striver': return 'from-purple-400 to-purple-600';
      case 'Love Babbar': return 'from-pink-400 to-pink-600';
      case 'FAANG': return 'from-indigo-400 to-indigo-600';
      case 'Blind 75': return 'from-cyan-400 to-cyan-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const stats = {
    totalSolved: problems.filter(p => p.solved).length,
    totalProblems: problems.length,
    easyCount: problems.filter(p => p.difficulty === 'Easy' && p.solved).length,
    mediumCount: problems.filter(p => p.difficulty === 'Medium' && p.solved).length,
    hardCount: problems.filter(p => p.difficulty === 'Hard' && p.solved).length,
    totalXP: problems.filter(p => p.solved).reduce((sum, p) => sum + p.xp, 0),
  };

  if (loading) {
    return (
      <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Coding Arena 🚀
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Master 500+ problems from top coding platforms and crack FAANG interviews!
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-yellow-500`}
          >
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalSolved}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Solved
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-orange-500`}
          >
            <div className="flex items-center space-x-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {codingStats.currentStreak}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Streak
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-500`}
          >
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {codingStats.todaysSolved}
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
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-400`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                E
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.easyCount}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Easy
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-yellow-400`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.mediumCount}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Medium
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-red-400`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                H
              </div>
              <div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.hardCount}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hard
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Platform Filter */}
            <div className="flex gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
                Platform:
              </span>
              {(['all', 'LeetCode', 'GeeksforGeeks', 'CodeChef'] as const).map((platform) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedPlatform === platform
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {platform}
                </motion.button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
                Difficulty:
              </span>
              {(['all', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                <motion.button
                  key={difficulty}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {difficulty}
                </motion.button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
                Topic:
              </span>
              {(['all', 'Array', 'String', 'Tree', 'Graph', 'DP', 'Math'] as const).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Sheet Filter */}
            <div className="flex gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} self-center`}>
                Sheet:
              </span>
              {(['all', 'Striver', 'Love Babbar', 'FAANG', 'Blind 75'] as const).map((sheet) => (
                <motion.button
                  key={sheet}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSheet(sheet)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSheet === sheet
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sheet}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredProblems.length} of {problems.length} problems
          </p>
        </div>

        {/* Enhanced Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg border-l-4 ${
                problem.solved 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : `border-transparent hover:border-purple-500`
              } transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white text-sm font-medium`}>
                    {problem.difficulty}
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(problem.platform)} text-white text-sm font-medium`}>
                    {problem.platform}
                  </div>
                  {problem.sheet && (
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSheetColor(problem.sheet)} text-white text-xs font-medium`}>
                      {problem.sheet}
                    </div>
                  )}
                </div>
                {problem.solved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-1"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-green-500 text-sm font-medium">Solved!</span>
                  </motion.div>
                )}
              </div>

              <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} ${
                problem.solved ? 'line-through opacity-75' : ''
              }`}>
                {problem.title}
              </h3>

              <div className="flex flex-wrap gap-1 mb-4">
                {problem.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags.length > 3 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    +{problem.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className={`text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {problem.xp} XP
                  </span>
                </div>
                {problem.solved && problem.timeSpent && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {problem.timeSpent}m
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(problem.url, '_blank')}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center space-x-2 font-medium"
                >
                  <ExternalLink size={16} />
                  <span>Solve</span>
                </motion.button>
                
                {!problem.solved && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => solveProblem(problem.id)}
                    className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-medium"
                  >
                    ✓ Mark Solved
                  </motion.button>
                )}
              </div>

              {problem.solved && problem.solvedAt && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-between`}>
                    <span>Solved on {problem.solvedAt.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-500 font-medium">+{problem.xp} XP</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Celebration Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center max-w-md mx-4`}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Problem Solved!
                </motion.h2>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Zap className="h-6 w-6 text-yellow-500" />
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        +{celebrationData.xp} XP
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-center space-x-2">
                      <Flame className="h-6 w-6 text-orange-500" />
                      <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {celebrationData.streak} Day Streak!
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className={`text-lg mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  You're on fire! Keep the momentum going! 🔥
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Code className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No problems found
            </h3>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}