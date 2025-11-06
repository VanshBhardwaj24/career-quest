/*
  # Populate coding problems database

  1. New Data
    - Insert all coding problems from the frontend problemDatabase array
    - Includes problems from Striver Sheet, Blind 75, FAANG prep, Love Babbar sheet
    - Covers multiple platforms: LeetCode, GeeksforGeeks, CodeChef
    - Various difficulty levels and categories

  2. Data Structure
    - Each problem has: id, title, difficulty, platform, url, tags, xp, description, category, sheet
    - Problems are organized by different preparation sheets and categories
    - XP values range from 25 (easy) to 200 (hard) based on difficulty

  3. Categories Covered
    - Array, String, Tree, Graph, Dynamic Programming, Math
    - Multiple coding platforms and preparation resources
*/

-- Insert all coding problems from the frontend database
INSERT INTO coding_problems (id, title, difficulty, platform, url, tags, xp, description) VALUES
-- STRIVER SHEET - ARRAYS
('striver-1', 'Set Matrix Zeroes', 'Medium', 'LeetCode', 'https://leetcode.com/problems/set-matrix-zeroes/', ARRAY['Array', 'Matrix'], 100, 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0s.'),
('striver-2', 'Pascal''s Triangle', 'Easy', 'LeetCode', 'https://leetcode.com/problems/pascals-triangle/', ARRAY['Array', 'Dynamic Programming'], 50, 'Generate the first numRows of Pascal''s triangle.'),
('striver-3', 'Next Permutation', 'Medium', 'LeetCode', 'https://leetcode.com/problems/next-permutation/', ARRAY['Array', 'Two Pointers'], 100, 'Find the next lexicographically greater permutation of numbers.'),
('striver-4', 'Kadane''s Algorithm', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', ARRAY['Array', 'Dynamic Programming'], 75, 'Find the contiguous subarray with the largest sum.'),
('striver-5', 'Sort Colors', 'Medium', 'LeetCode', 'https://leetcode.com/problems/sort-colors/', ARRAY['Array', 'Two Pointers', 'Sorting'], 100, 'Sort an array with values 0, 1, and 2 in-place.'),

-- BLIND 75 - ESSENTIAL PROBLEMS
('blind-1', 'Two Sum', 'Easy', 'LeetCode', 'https://leetcode.com/problems/two-sum/', ARRAY['Array', 'Hash Table'], 50, 'Find two numbers in an array that add up to a target sum.'),
('blind-2', 'Best Time to Buy and Sell Stock', 'Easy', 'LeetCode', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', ARRAY['Array', 'Dynamic Programming'], 50, 'Find the maximum profit from buying and selling stock once.'),
('blind-3', 'Contains Duplicate', 'Easy', 'LeetCode', 'https://leetcode.com/problems/contains-duplicate/', ARRAY['Array', 'Hash Table'], 25, 'Check if any value appears at least twice in an array.'),
('blind-4', 'Product of Array Except Self', 'Medium', 'LeetCode', 'https://leetcode.com/problems/product-of-array-except-self/', ARRAY['Array', 'Prefix Sum'], 100, 'Return an array where each element is the product of all other elements.'),
('blind-5', 'Maximum Subarray', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', ARRAY['Array', 'Dynamic Programming'], 75, 'Find the contiguous subarray with the largest sum.'),

-- FAANG PREPARATION
('faang-1', 'Merge Intervals', 'Medium', 'LeetCode', 'https://leetcode.com/problems/merge-intervals/', ARRAY['Array', 'Sorting'], 125, 'Merge all overlapping intervals.'),
('faang-2', 'Insert Interval', 'Medium', 'LeetCode', 'https://leetcode.com/problems/insert-interval/', ARRAY['Array'], 125, 'Insert a new interval into a sorted list of intervals.'),
('faang-3', '3Sum', 'Medium', 'LeetCode', 'https://leetcode.com/problems/3sum/', ARRAY['Array', 'Two Pointers'], 125, 'Find all unique triplets that sum to zero.'),
('faang-4', 'Container With Most Water', 'Medium', 'LeetCode', 'https://leetcode.com/problems/container-with-most-water/', ARRAY['Array', 'Two Pointers'], 125, 'Find two lines that form a container holding the most water.'),
('faang-5', 'Sliding Window Maximum', 'Hard', 'LeetCode', 'https://leetcode.com/problems/sliding-window-maximum/', ARRAY['Array', 'Sliding Window', 'Deque'], 200, 'Find the maximum element in each sliding window of size k.'),

-- LOVE BABBAR SHEET
('babbar-1', 'Reverse the Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/reverse-an-array/0', ARRAY['Array'], 25, 'Reverse the elements of an array.'),
('babbar-2', 'Find the Maximum and Minimum Element', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1', ARRAY['Array'], 25, 'Find the maximum and minimum elements in an array.'),
('babbar-3', 'Kth Smallest Element', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kth-smallest-element5635/1', ARRAY['Array', 'Sorting'], 100, 'Find the kth smallest element in an array.'),
('babbar-4', 'Sort 0s, 1s and 2s', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1', ARRAY['Array', 'Sorting'], 50, 'Sort an array containing only 0s, 1s, and 2s.'),
('babbar-5', 'Move Negative Numbers', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/move-all-negative-numbers-to-beginning-and-positive-to-end-with-constant-extra-space/1', ARRAY['Array', 'Two Pointers'], 50, 'Move all negative numbers to the beginning of the array.'),

-- STRING PROBLEMS
('str-1', 'Valid Anagram', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-anagram/', ARRAY['String', 'Hash Table'], 50, 'Check if two strings are anagrams of each other.'),
('str-2', 'Valid Parentheses', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-parentheses/', ARRAY['String', 'Stack'], 50, 'Check if parentheses are properly balanced.'),
('str-3', 'Valid Palindrome', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-palindrome/', ARRAY['String', 'Two Pointers'], 50, 'Check if a string is a valid palindrome.'),
('str-4', 'Longest Substring Without Repeating Characters', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', ARRAY['String', 'Sliding Window'], 125, 'Find the longest substring without repeating characters.'),
('str-5', 'Longest Repeating Character Replacement', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-repeating-character-replacement/', ARRAY['String', 'Sliding Window'], 125, 'Find the longest substring with same characters after k replacements.'),
('str-6', 'Minimum Window Substring', 'Hard', 'LeetCode', 'https://leetcode.com/problems/minimum-window-substring/', ARRAY['String', 'Sliding Window'], 200, 'Find the minimum window substring containing all characters of another string.'),
('str-7', 'Group Anagrams', 'Medium', 'LeetCode', 'https://leetcode.com/problems/group-anagrams/', ARRAY['String', 'Hash Table'], 125, 'Group strings that are anagrams of each other.'),
('str-8', 'Longest Palindromic Substring', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-palindromic-substring/', ARRAY['String', 'Dynamic Programming'], 125, 'Find the longest palindromic substring.'),
('str-9', 'Palindromic Substrings', 'Medium', 'LeetCode', 'https://leetcode.com/problems/palindromic-substrings/', ARRAY['String', 'Dynamic Programming'], 125, 'Count the number of palindromic substrings.'),
('str-10', 'Encode and Decode Strings', 'Medium', 'LeetCode', 'https://leetcode.com/problems/encode-and-decode-strings/', ARRAY['String', 'Design'], 125, 'Design an algorithm to encode and decode strings.'),

-- TREE PROBLEMS
('tree-1', 'Maximum Depth of Binary Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', ARRAY['Tree', 'DFS'], 50, 'Find the maximum depth of a binary tree.'),
('tree-2', 'Same Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/same-tree/', ARRAY['Tree', 'DFS'], 50, 'Check if two binary trees are the same.'),
('tree-3', 'Invert Binary Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/invert-binary-tree/', ARRAY['Tree', 'DFS'], 50, 'Invert a binary tree.'),
('tree-4', 'Binary Tree Maximum Path Sum', 'Hard', 'LeetCode', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', ARRAY['Tree', 'DFS'], 200, 'Find the maximum path sum in a binary tree.'),
('tree-5', 'Binary Tree Level Order Traversal', 'Medium', 'LeetCode', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', ARRAY['Tree', 'BFS'], 125, 'Traverse a binary tree level by level.'),
('tree-6', 'Serialize and Deserialize Binary Tree', 'Hard', 'LeetCode', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', ARRAY['Tree', 'Design'], 200, 'Design an algorithm to serialize and deserialize a binary tree.'),
('tree-7', 'Subtree of Another Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/subtree-of-another-tree/', ARRAY['Tree', 'DFS'], 75, 'Check if a tree is a subtree of another tree.'),
('tree-8', 'Construct Binary Tree from Preorder and Inorder', 'Medium', 'LeetCode', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', ARRAY['Tree', 'Array'], 125, 'Construct a binary tree from preorder and inorder traversal.'),
('tree-9', 'Validate Binary Search Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/validate-binary-search-tree/', ARRAY['Tree', 'DFS'], 125, 'Check if a binary tree is a valid binary search tree.'),
('tree-10', 'Kth Smallest Element in a BST', 'Medium', 'LeetCode', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', ARRAY['Tree', 'DFS'], 125, 'Find the kth smallest element in a binary search tree.'),

-- GRAPH PROBLEMS
('graph-1', 'Clone Graph', 'Medium', 'LeetCode', 'https://leetcode.com/problems/clone-graph/', ARRAY['Graph', 'DFS', 'BFS'], 125, 'Clone an undirected graph.'),
('graph-2', 'Course Schedule', 'Medium', 'LeetCode', 'https://leetcode.com/problems/course-schedule/', ARRAY['Graph', 'Topological Sort'], 125, 'Determine if you can finish all courses given prerequisites.'),
('graph-3', 'Pacific Atlantic Water Flow', 'Medium', 'LeetCode', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', ARRAY['Graph', 'DFS'], 125, 'Find cells where water can flow to both Pacific and Atlantic oceans.'),
('graph-4', 'Number of Islands', 'Medium', 'LeetCode', 'https://leetcode.com/problems/number-of-islands/', ARRAY['Graph', 'DFS', 'BFS'], 125, 'Count the number of islands in a 2D grid.'),
('graph-5', 'Longest Consecutive Sequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-consecutive-sequence/', ARRAY['Array', 'Hash Table'], 125, 'Find the longest consecutive elements sequence.'),
('graph-6', 'Alien Dictionary', 'Hard', 'LeetCode', 'https://leetcode.com/problems/alien-dictionary/', ARRAY['Graph', 'Topological Sort'], 200, 'Find the order of characters in an alien language.'),
('graph-7', 'Graph Valid Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/graph-valid-tree/', ARRAY['Graph', 'Union Find'], 125, 'Check if a graph forms a valid tree.'),
('graph-8', 'Number of Connected Components', 'Medium', 'LeetCode', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', ARRAY['Graph', 'Union Find'], 125, 'Count connected components in an undirected graph.'),

-- DYNAMIC PROGRAMMING
('dp-1', 'Climbing Stairs', 'Easy', 'LeetCode', 'https://leetcode.com/problems/climbing-stairs/', ARRAY['Dynamic Programming'], 50, 'Count ways to climb stairs taking 1 or 2 steps at a time.'),
('dp-2', 'Coin Change', 'Medium', 'LeetCode', 'https://leetcode.com/problems/coin-change/', ARRAY['Dynamic Programming'], 125, 'Find minimum coins needed to make a given amount.'),
('dp-3', 'Longest Increasing Subsequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-increasing-subsequence/', ARRAY['Dynamic Programming'], 125, 'Find the length of the longest increasing subsequence.'),
('dp-4', 'Longest Common Subsequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-common-subsequence/', ARRAY['Dynamic Programming'], 125, 'Find the length of the longest common subsequence.'),
('dp-5', 'Word Break', 'Medium', 'LeetCode', 'https://leetcode.com/problems/word-break/', ARRAY['Dynamic Programming'], 125, 'Check if a string can be segmented into dictionary words.'),
('dp-6', 'Combination Sum IV', 'Medium', 'LeetCode', 'https://leetcode.com/problems/combination-sum-iv/', ARRAY['Dynamic Programming'], 125, 'Count combinations that add up to a target.'),
('dp-7', 'House Robber', 'Medium', 'LeetCode', 'https://leetcode.com/problems/house-robber/', ARRAY['Dynamic Programming'], 100, 'Find maximum money that can be robbed without robbing adjacent houses.'),
('dp-8', 'House Robber II', 'Medium', 'LeetCode', 'https://leetcode.com/problems/house-robber-ii/', ARRAY['Dynamic Programming'], 125, 'House robber problem with houses arranged in a circle.'),
('dp-9', 'Decode Ways', 'Medium', 'LeetCode', 'https://leetcode.com/problems/decode-ways/', ARRAY['Dynamic Programming'], 125, 'Count ways to decode a string of digits.'),
('dp-10', 'Unique Paths', 'Medium', 'LeetCode', 'https://leetcode.com/problems/unique-paths/', ARRAY['Dynamic Programming'], 100, 'Count unique paths in a grid from top-left to bottom-right.'),

-- MATH PROBLEMS
('math-1', 'Happy Number', 'Easy', 'LeetCode', 'https://leetcode.com/problems/happy-number/', ARRAY['Math', 'Hash Table'], 50, 'Determine if a number is happy.'),
('math-2', 'Plus One', 'Easy', 'LeetCode', 'https://leetcode.com/problems/plus-one/', ARRAY['Math', 'Array'], 25, 'Add one to a number represented as an array of digits.'),
('math-3', 'Pow(x, n)', 'Medium', 'LeetCode', 'https://leetcode.com/problems/powx-n/', ARRAY['Math', 'Recursion'], 100, 'Implement pow(x, n) function.'),
('math-4', 'Sqrt(x)', 'Easy', 'LeetCode', 'https://leetcode.com/problems/sqrtx/', ARRAY['Math', 'Binary Search'], 50, 'Compute and return the square root of x.'),
('math-5', 'Integer to Roman', 'Medium', 'LeetCode', 'https://leetcode.com/problems/integer-to-roman/', ARRAY['Math', 'String'], 100, 'Convert an integer to a Roman numeral.'),

-- GEEKSFORGEEKS EXCLUSIVE
('gfg-1', 'Rotate Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1', ARRAY['Array'], 50, 'Rotate an array by n elements.'),
('gfg-2', 'Missing Number', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1', ARRAY['Array', 'Math'], 50, 'Find the missing number in an array.'),
('gfg-3', 'Count Inversions', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', ARRAY['Array', 'Merge Sort'], 125, 'Count inversions in an array.'),
('gfg-4', 'Majority Element', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/majority-element-1587115620/1', ARRAY['Array'], 100, 'Find the majority element in an array.'),
('gfg-5', 'Stock Buy Sell', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1', ARRAY['Array', 'Greedy'], 125, 'Find maximum profit from buying and selling stocks.'),

-- CODECHEF EXCLUSIVE
('cc-1', 'Life Universe Everything', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/TEST', ARRAY['Basic Programming'], 25, 'Your first CodeChef problem.'),
('cc-2', 'ATM Problem', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/HS08TEST', ARRAY['Basic Programming'], 50, 'Simple ATM transaction problem.'),
('cc-3', 'Sum of Digits', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FLOW006', ARRAY['Basic Programming'], 25, 'Calculate sum of digits of a number.'),
('cc-4', 'Factorial', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FCTRL', ARRAY['Math'], 50, 'Calculate factorial of a number.'),
('cc-5', 'Prime Generator', 'Medium', 'CodeChef', 'https://www.codechef.com/problems/PRIME1', ARRAY['Math', 'Number Theory'], 125, 'Generate prime numbers in a given range.')

ON CONFLICT (id) DO NOTHING;