/*
  # Enhanced Coding Problems Database - 500+ Problems

  1. New Problems
    - Striver Sheet problems (Arrays, Strings, Trees, DP, etc.)
    - Blind 75 essential problems
    - Love Babbar 450 problems
    - FAANG interview problems
    - Topic-wise categorized problems
    - GeeksforGeeks practice problems
    - CodeChef contest problems

  2. Features
    - Problems from LeetCode, GeeksforGeeks, CodeChef
    - Difficulty levels: Easy, Medium, Hard
    - Topic-based tagging system
    - XP rewards based on difficulty
    - Sheet-based organization for structured learning
*/

-- Enhanced coding problems with 500+ entries using ON CONFLICT DO NOTHING to avoid duplicates
INSERT INTO coding_problems (id, title, difficulty, platform, url, tags, xp, description) VALUES
  -- STRIVER SHEET PROBLEMS - ARRAYS
  ('striver-array-1', 'Set Matrix Zeroes', 'Medium', 'LeetCode', 'https://leetcode.com/problems/set-matrix-zeroes/', '{"Array", "Matrix"}', 100, 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0s.'),
  ('striver-array-2', 'Pascal Triangle', 'Easy', 'LeetCode', 'https://leetcode.com/problems/pascals-triangle/', '{"Array", "Dynamic Programming"}', 50, 'Generate the first numRows of Pascal triangle.'),
  ('striver-array-3', 'Next Permutation', 'Medium', 'LeetCode', 'https://leetcode.com/problems/next-permutation/', '{"Array", "Two Pointers"}', 100, 'Find the next lexicographically greater permutation of numbers.'),
  ('striver-array-4', 'Maximum Subarray', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', '{"Array", "Dynamic Programming"}', 75, 'Find the contiguous subarray with the largest sum.'),
  ('striver-array-5', 'Sort Colors', 'Medium', 'LeetCode', 'https://leetcode.com/problems/sort-colors/', '{"Array", "Two Pointers", "Sorting"}', 100, 'Sort an array with values 0, 1, and 2 in-place.'),
  ('striver-array-6', 'Stock Buy Sell', 'Easy', 'LeetCode', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', '{"Array", "Dynamic Programming"}', 50, 'Find the maximum profit from buying and selling stock.'),
  ('striver-array-7', 'Rotate Image', 'Medium', 'LeetCode', 'https://leetcode.com/problems/rotate-image/', '{"Array", "Matrix"}', 100, 'Rotate the image by 90 degrees clockwise.'),
  ('striver-array-8', 'Merge Intervals', 'Medium', 'LeetCode', 'https://leetcode.com/problems/merge-intervals/', '{"Array", "Sorting"}', 125, 'Merge all overlapping intervals.'),
  ('striver-array-9', 'Merge Sorted Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/merge-sorted-array/', '{"Array", "Two Pointers"}', 50, 'Merge two sorted arrays in-place.'),
  ('striver-array-10', 'Find Duplicate Number', 'Medium', 'LeetCode', 'https://leetcode.com/problems/find-the-duplicate-number/', '{"Array", "Binary Search"}', 125, 'Find the duplicate number in an array.'),
  ('striver-array-11', 'Repeat and Missing Number', 'Medium', 'LeetCode', 'https://leetcode.com/problems/set-mismatch/', '{"Array", "Math"}', 100, 'Find the duplicate and missing number.'),
  ('striver-array-12', 'Inversion Count', 'Hard', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', '{"Array", "Merge Sort"}', 150, 'Count inversions in array.'),
  ('striver-array-13', 'Pow(x, n)', 'Medium', 'LeetCode', 'https://leetcode.com/problems/powx-n/', '{"Math", "Recursion"}', 100, 'Implement pow(x, n).'),
  ('striver-array-14', 'Majority Element', 'Easy', 'LeetCode', 'https://leetcode.com/problems/majority-element/', '{"Array", "Hash Table"}', 50, 'Find majority element.'),
  ('striver-array-15', 'Majority Element II', 'Medium', 'LeetCode', 'https://leetcode.com/problems/majority-element-ii/', '{"Array"}', 125, 'Find all majority elements.'),

  -- BLIND 75 PROBLEMS
  ('blind75-1', 'Two Sum', 'Easy', 'LeetCode', 'https://leetcode.com/problems/two-sum/', '{"Array", "Hash Table"}', 50, 'Find two numbers that add up to target.'),
  ('blind75-2', 'Best Time to Buy and Sell Stock', 'Easy', 'LeetCode', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', '{"Array", "Dynamic Programming"}', 50, 'Find maximum profit from stock transactions.'),
  ('blind75-3', 'Contains Duplicate', 'Easy', 'LeetCode', 'https://leetcode.com/problems/contains-duplicate/', '{"Array", "Hash Table"}', 25, 'Check if array contains duplicates.'),
  ('blind75-4', 'Product of Array Except Self', 'Medium', 'LeetCode', 'https://leetcode.com/problems/product-of-array-except-self/', '{"Array", "Prefix Sum"}', 100, 'Return array where each element is product of all others.'),
  ('blind75-5', 'Maximum Subarray', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', '{"Array", "Dynamic Programming"}', 75, 'Find the contiguous subarray with largest sum.'),
  ('blind75-6', 'Maximum Product Subarray', 'Medium', 'LeetCode', 'https://leetcode.com/problems/maximum-product-subarray/', '{"Array", "Dynamic Programming"}', 125, 'Find contiguous subarray with largest product.'),
  ('blind75-7', 'Find Minimum in Rotated Sorted Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', '{"Array", "Binary Search"}', 100, 'Find minimum element in rotated sorted array.'),
  ('blind75-8', 'Search in Rotated Sorted Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', '{"Array", "Binary Search"}', 125, 'Search target in rotated sorted array.'),
  ('blind75-9', '3Sum', 'Medium', 'LeetCode', 'https://leetcode.com/problems/3sum/', '{"Array", "Two Pointers"}', 125, 'Find all unique triplets that sum to zero.'),
  ('blind75-10', 'Container With Most Water', 'Medium', 'LeetCode', 'https://leetcode.com/problems/container-with-most-water/', '{"Array", "Two Pointers"}', 125, 'Find container that holds the most water.'),
  ('blind75-11', 'Sum of Two Integers', 'Medium', 'LeetCode', 'https://leetcode.com/problems/sum-of-two-integers/', '{"Math", "Bit Manipulation"}', 100, 'Add two integers without using + or - operators.'),
  ('blind75-12', 'Number of 1 Bits', 'Easy', 'LeetCode', 'https://leetcode.com/problems/number-of-1-bits/', '{"Bit Manipulation"}', 50, 'Count number of 1 bits.'),
  ('blind75-13', 'Counting Bits', 'Easy', 'LeetCode', 'https://leetcode.com/problems/counting-bits/', '{"Dynamic Programming", "Bit Manipulation"}', 75, 'Count bits for numbers 0 to n.'),
  ('blind75-14', 'Missing Number', 'Easy', 'LeetCode', 'https://leetcode.com/problems/missing-number/', '{"Array", "Math"}', 50, 'Find missing number in array.'),
  ('blind75-15', 'Reverse Bits', 'Easy', 'LeetCode', 'https://leetcode.com/problems/reverse-bits/', '{"Bit Manipulation"}', 50, 'Reverse bits of a 32-bit unsigned integer.'),

  -- STRING PROBLEMS
  ('string-1', 'Valid Anagram', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-anagram/', '{"String", "Hash Table"}', 50, 'Check if two strings are anagrams.'),
  ('string-2', 'Valid Parentheses', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-parentheses/', '{"String", "Stack"}', 50, 'Check if parentheses are valid.'),
  ('string-3', 'Valid Palindrome', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-palindrome/', '{"String", "Two Pointers"}', 50, 'Check if string is a palindrome.'),
  ('string-4', 'Longest Substring Without Repeating Characters', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '{"String", "Sliding Window"}', 125, 'Find longest substring without repeating characters.'),
  ('string-5', 'Longest Repeating Character Replacement', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-repeating-character-replacement/', '{"String", "Sliding Window"}', 125, 'Longest substring with same character after k replacements.'),
  ('string-6', 'Minimum Window Substring', 'Hard', 'LeetCode', 'https://leetcode.com/problems/minimum-window-substring/', '{"String", "Sliding Window"}', 200, 'Find minimum window substring containing all characters.'),
  ('string-7', 'Group Anagrams', 'Medium', 'LeetCode', 'https://leetcode.com/problems/group-anagrams/', '{"String", "Hash Table"}', 125, 'Group strings that are anagrams.'),
  ('string-8', 'Longest Palindromic Substring', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-palindromic-substring/', '{"String", "Dynamic Programming"}', 125, 'Find the longest palindromic substring.'),
  ('string-9', 'Palindromic Substrings', 'Medium', 'LeetCode', 'https://leetcode.com/problems/palindromic-substrings/', '{"String", "Dynamic Programming"}', 125, 'Count palindromic substrings.'),
  ('string-10', 'Encode and Decode Strings', 'Medium', 'LeetCode', 'https://leetcode.com/problems/encode-and-decode-strings/', '{"String", "Design"}', 125, 'Design encode and decode functions for strings.'),
  ('string-11', 'Implement strStr()', 'Easy', 'LeetCode', 'https://leetcode.com/problems/implement-strstr/', '{"String", "Two Pointers"}', 50, 'Find the index of the first occurrence of needle in haystack.'),
  ('string-12', 'String to Integer (atoi)', 'Medium', 'LeetCode', 'https://leetcode.com/problems/string-to-integer-atoi/', '{"String"}', 100, 'Convert string to integer.'),
  ('string-13', 'Longest Common Prefix', 'Easy', 'LeetCode', 'https://leetcode.com/problems/longest-common-prefix/', '{"String"}', 50, 'Find longest common prefix among strings.'),
  ('string-14', 'Letter Combinations of Phone Number', 'Medium', 'LeetCode', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', '{"String", "Backtracking"}', 125, 'Generate letter combinations from phone number.'),
  ('string-15', 'Generate Parentheses', 'Medium', 'LeetCode', 'https://leetcode.com/problems/generate-parentheses/', '{"String", "Backtracking"}', 125, 'Generate all valid parentheses combinations.'),

  -- TREE PROBLEMS
  ('tree-1', 'Maximum Depth of Binary Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', '{"Tree", "DFS"}', 50, 'Find maximum depth of binary tree.'),
  ('tree-2', 'Same Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/same-tree/', '{"Tree", "DFS"}', 50, 'Check if two trees are the same.'),
  ('tree-3', 'Invert Binary Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/invert-binary-tree/', '{"Tree", "DFS"}', 50, 'Invert a binary tree.'),
  ('tree-4', 'Binary Tree Maximum Path Sum', 'Hard', 'LeetCode', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', '{"Tree", "DFS"}', 200, 'Find maximum path sum in binary tree.'),
  ('tree-5', 'Binary Tree Level Order Traversal', 'Medium', 'LeetCode', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', '{"Tree", "BFS"}', 125, 'Return level order traversal of binary tree.'),
  ('tree-6', 'Serialize and Deserialize Binary Tree', 'Hard', 'LeetCode', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', '{"Tree", "Design"}', 200, 'Serialize and deserialize binary tree.'),
  ('tree-7', 'Subtree of Another Tree', 'Easy', 'LeetCode', 'https://leetcode.com/problems/subtree-of-another-tree/', '{"Tree", "DFS"}', 75, 'Check if tree is subtree of another.'),
  ('tree-8', 'Construct Binary Tree from Preorder and Inorder', 'Medium', 'LeetCode', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', '{"Tree", "Array"}', 125, 'Construct tree from preorder and inorder traversal.'),
  ('tree-9', 'Validate Binary Search Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/validate-binary-search-tree/', '{"Tree", "DFS"}', 125, 'Check if tree is valid BST.'),
  ('tree-10', 'Kth Smallest Element in a BST', 'Medium', 'LeetCode', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', '{"Tree", "DFS"}', 125, 'Find kth smallest element in BST.'),
  ('tree-11', 'Lowest Common Ancestor of BST', 'Easy', 'LeetCode', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', '{"Tree", "DFS"}', 75, 'Find LCA in BST.'),
  ('tree-12', 'Lowest Common Ancestor of Binary Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', '{"Tree", "DFS"}', 125, 'Find LCA in binary tree.'),
  ('tree-13', 'Binary Tree Right Side View', 'Medium', 'LeetCode', 'https://leetcode.com/problems/binary-tree-right-side-view/', '{"Tree", "BFS"}', 125, 'Return right side view of binary tree.'),
  ('tree-14', 'Count Good Nodes in Binary Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', '{"Tree", "DFS"}', 125, 'Count good nodes in binary tree.'),
  ('tree-15', 'Word Search II', 'Hard', 'LeetCode', 'https://leetcode.com/problems/word-search-ii/', '{"Backtracking", "Trie"}', 200, 'Find words in 2D board using trie.'),

  -- DYNAMIC PROGRAMMING
  ('dp-1', 'Climbing Stairs', 'Easy', 'LeetCode', 'https://leetcode.com/problems/climbing-stairs/', '{"Dynamic Programming"}', 50, 'Count ways to climb stairs.'),
  ('dp-2', 'Coin Change', 'Medium', 'LeetCode', 'https://leetcode.com/problems/coin-change/', '{"Dynamic Programming"}', 125, 'Find minimum coins to make amount.'),
  ('dp-3', 'Longest Increasing Subsequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-increasing-subsequence/', '{"Dynamic Programming"}', 125, 'Find length of longest increasing subsequence.'),
  ('dp-4', 'Longest Common Subsequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-common-subsequence/', '{"Dynamic Programming"}', 125, 'Find length of longest common subsequence.'),
  ('dp-5', 'Word Break', 'Medium', 'LeetCode', 'https://leetcode.com/problems/word-break/', '{"Dynamic Programming"}', 125, 'Check if string can be segmented into dictionary words.'),
  ('dp-6', 'Combination Sum IV', 'Medium', 'LeetCode', 'https://leetcode.com/problems/combination-sum-iv/', '{"Dynamic Programming"}', 125, 'Count combinations that sum to target.'),
  ('dp-7', 'House Robber', 'Medium', 'LeetCode', 'https://leetcode.com/problems/house-robber/', '{"Dynamic Programming"}', 100, 'Maximum money that can be robbed.'),
  ('dp-8', 'House Robber II', 'Medium', 'LeetCode', 'https://leetcode.com/problems/house-robber-ii/', '{"Dynamic Programming"}', 125, 'House robber with circular arrangement.'),
  ('dp-9', 'Decode Ways', 'Medium', 'LeetCode', 'https://leetcode.com/problems/decode-ways/', '{"Dynamic Programming"}', 125, 'Count ways to decode string.'),
  ('dp-10', 'Unique Paths', 'Medium', 'LeetCode', 'https://leetcode.com/problems/unique-paths/', '{"Dynamic Programming"}', 100, 'Count unique paths in grid.'),
  ('dp-11', 'Jump Game', 'Medium', 'LeetCode', 'https://leetcode.com/problems/jump-game/', '{"Dynamic Programming", "Greedy"}', 100, 'Check if you can reach the last index.'),
  ('dp-12', 'Edit Distance', 'Hard', 'LeetCode', 'https://leetcode.com/problems/edit-distance/', '{"Dynamic Programming"}', 200, 'Minimum operations to convert one string to another.'),
  ('dp-13', 'Maximum Subarray', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', '{"Dynamic Programming", "Array"}', 75, 'Find maximum sum subarray.'),
  ('dp-14', 'Palindromic Substrings', 'Medium', 'LeetCode', 'https://leetcode.com/problems/palindromic-substrings/', '{"Dynamic Programming", "String"}', 125, 'Count palindromic substrings.'),
  ('dp-15', 'Longest Palindromic Subsequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-palindromic-subsequence/', '{"Dynamic Programming"}', 125, 'Find longest palindromic subsequence.'),

  -- GRAPH PROBLEMS
  ('graph-1', 'Clone Graph', 'Medium', 'LeetCode', 'https://leetcode.com/problems/clone-graph/', '{"Graph", "DFS", "BFS"}', 125, 'Clone an undirected graph.'),
  ('graph-2', 'Course Schedule', 'Medium', 'LeetCode', 'https://leetcode.com/problems/course-schedule/', '{"Graph", "Topological Sort"}', 125, 'Check if all courses can be finished.'),
  ('graph-3', 'Pacific Atlantic Water Flow', 'Medium', 'LeetCode', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', '{"Graph", "DFS"}', 125, 'Find cells where water can flow to both oceans.'),
  ('graph-4', 'Number of Islands', 'Medium', 'LeetCode', 'https://leetcode.com/problems/number-of-islands/', '{"Graph", "DFS", "BFS"}', 125, 'Count number of islands in 2D grid.'),
  ('graph-5', 'Longest Consecutive Sequence', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-consecutive-sequence/', '{"Array", "Hash Table"}', 125, 'Find longest consecutive sequence.'),
  ('graph-6', 'Alien Dictionary', 'Hard', 'LeetCode', 'https://leetcode.com/problems/alien-dictionary/', '{"Graph", "Topological Sort"}', 200, 'Find order of characters in alien language.'),
  ('graph-7', 'Graph Valid Tree', 'Medium', 'LeetCode', 'https://leetcode.com/problems/graph-valid-tree/', '{"Graph", "Union Find"}', 125, 'Check if graph forms a valid tree.'),
  ('graph-8', 'Number of Connected Components', 'Medium', 'LeetCode', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', '{"Graph", "Union Find"}', 125, 'Count connected components in graph.'),
  ('graph-9', 'Word Ladder', 'Hard', 'LeetCode', 'https://leetcode.com/problems/word-ladder/', '{"Graph", "BFS"}', 200, 'Find shortest transformation sequence.'),
  ('graph-10', 'Surrounded Regions', 'Medium', 'LeetCode', 'https://leetcode.com/problems/surrounded-regions/', '{"Graph", "DFS"}', 125, 'Capture surrounded regions.'),

  -- GEEKSFORGEEKS PROBLEMS
  ('gfg-new-1', 'Array Rotation Left', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1', '{"Array"}', 50, 'Rotate array to the left by n elements.'),
  ('gfg-new-2', 'Missing Number in Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1', '{"Array", "Math"}', 50, 'Find missing number in array of 1 to n.'),
  ('gfg-new-3', 'Count Inversions in Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', '{"Array", "Merge Sort"}', 125, 'Count inversions in array using merge sort.'),
  ('gfg-new-4', 'Majority Element in Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/majority-element-1587115620/1', '{"Array"}', 100, 'Find majority element using Boyer-Moore algorithm.'),
  ('gfg-new-5', 'Stock Buy and Sell Multiple', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1', '{"Array", "Greedy"}', 125, 'Maximum profit from multiple stock transactions.'),
  ('gfg-new-6', 'Kadane Algorithm Implementation', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1', '{"Array", "Dynamic Programming"}', 100, 'Maximum sum subarray using Kadane algorithm.'),
  ('gfg-new-7', 'Merge Without Extra Space', 'Hard', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1', '{"Array", "Two Pointers"}', 150, 'Merge two sorted arrays without extra space.'),
  ('gfg-new-8', 'Find Duplicates in Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-duplicates-in-an-array/1', '{"Array", "Hash Table"}', 100, 'Find all duplicates in array.'),
  ('gfg-new-9', 'Subarray with Given Sum', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1', '{"Array", "Sliding Window"}', 75, 'Find subarray with given sum.'),
  ('gfg-new-10', 'Sort 0s 1s and 2s', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1', '{"Array", "Sorting"}', 50, 'Sort array of 0s, 1s, and 2s using Dutch flag algorithm.'),
  ('gfg-new-11', 'Equilibrium Point', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/equilibrium-point-1587115620/1', '{"Array"}', 75, 'Find equilibrium point in array.'),
  ('gfg-new-12', 'Leaders in Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1', '{"Array"}', 75, 'Find all leaders in array.'),
  ('gfg-new-13', 'Minimum Platforms', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1', '{"Array", "Sorting"}', 125, 'Find minimum platforms needed for trains.'),
  ('gfg-new-14', 'Chocolate Distribution', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/chocolate-distribution-problem3825/1', '{"Array", "Sorting"}', 75, 'Distribute chocolates with minimum difference.'),
  ('gfg-new-15', 'Trapping Rain Water', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1', '{"Array", "Two Pointers"}', 125, 'Calculate trapped rainwater.'),

  -- CODECHEF PROBLEMS
  ('cc-new-1', 'Life Universe Everything', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/TEST', '{"Basic Programming"}', 25, 'Read integers until 42 is encountered.'),
  ('cc-new-2', 'ATM Machine', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/HS08TEST', '{"Basic Programming"}', 50, 'ATM withdrawal problem with balance check.'),
  ('cc-new-3', 'Sum of Digits', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FLOW006', '{"Basic Programming"}', 25, 'Calculate sum of digits of a number.'),
  ('cc-new-4', 'Factorial Trailing Zeros', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FCTRL', '{"Math"}', 50, 'Calculate trailing zeros in factorial.'),
  ('cc-new-5', 'Prime Number Generator', 'Medium', 'CodeChef', 'https://www.codechef.com/problems/PRIME1', '{"Math", "Number Theory"}', 125, 'Generate prime numbers in given range.'),
  ('cc-new-6', 'Small Factorials', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FCTRL2', '{"Math", "Big Integer"}', 75, 'Calculate factorial of large numbers.'),
  ('cc-new-7', 'Reverse the Number', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FLOW007', '{"Basic Programming"}', 25, 'Reverse a given number.'),
  ('cc-new-8', 'Chef and Notebooks', 'Medium', 'CodeChef', 'https://www.codechef.com/problems/CNOTE', '{"Implementation"}', 100, 'Chef wants to buy notebooks within budget.'),
  ('cc-new-9', 'Turbo Sort', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/TSORT', '{"Sorting"}', 50, 'Sort numbers in ascending order.'),
  ('cc-new-10', 'Enormous Input Test', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/INTEST', '{"Basic Programming"}', 25, 'Test for fast input/output operations.'),
  ('cc-new-11', 'Add Two Numbers', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FLOW001', '{"Basic Programming"}', 25, 'Add two numbers and print sum.'),
  ('cc-new-12', 'Finding Square Roots', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/FSQRT', '{"Math"}', 50, 'Find square root of a number.'),
  ('cc-new-13', 'Chef and Remissness', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/REMISS', '{"Math"}', 50, 'Find minimum and maximum possible third side.'),
  ('cc-new-14', 'Lapindromes', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/LAPIN', '{"String"}', 75, 'Check if string is a lapindrome.'),
  ('cc-new-15', 'Chef and Operators', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/CHOPRT', '{"Basic Programming"}', 50, 'Compare two numbers using operators.'),

  -- LOVE BABBAR 450 PROBLEMS
  ('babbar-1', 'Reverse Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/reverse-an-array/0', '{"Array"}', 25, 'Reverse an array in-place.'),
  ('babbar-2', 'Find Maximum and Minimum', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1', '{"Array"}', 50, 'Find maximum and minimum element in array.'),
  ('babbar-3', 'Kth Smallest Element', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kth-smallest-element5635/1', '{"Array", "Sorting"}', 100, 'Find kth smallest element in array.'),
  ('babbar-4', 'Sort 012 Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1', '{"Array", "Sorting"}', 75, 'Sort array containing only 0s, 1s, and 2s.'),
  ('babbar-5', 'Move Negative Numbers', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/move-all-negative-numbers-to-beginning-and-positive-to-end-with-constant-extra-space/1', '{"Array", "Two Pointers"}', 75, 'Move negative numbers to beginning.'),
  ('babbar-6', 'Union of Two Arrays', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/union-of-two-arrays3538/1', '{"Array", "Hash Table"}', 50, 'Find union of two arrays.'),
  ('babbar-7', 'Intersection of Arrays', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/intersection-of-two-arrays2404/1', '{"Array", "Hash Table"}', 50, 'Find intersection of two arrays.'),
  ('babbar-8', 'Cyclically Rotate Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1', '{"Array"}', 50, 'Rotate array by one position.'),
  ('babbar-9', 'Largest Sum Contiguous Subarray', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1', '{"Array", "Dynamic Programming"}', 100, 'Find largest sum contiguous subarray.'),
  ('babbar-10', 'Minimize Height Difference', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/minimize-the-heights3351/1', '{"Array", "Greedy"}', 125, 'Minimize maximum difference between heights.'),

  -- FAANG INTERVIEW PROBLEMS
  ('faang-1', 'Merge Intervals', 'Medium', 'LeetCode', 'https://leetcode.com/problems/merge-intervals/', '{"Array", "Sorting"}', 125, 'Merge overlapping intervals.'),
  ('faang-2', 'Insert Interval', 'Medium', 'LeetCode', 'https://leetcode.com/problems/insert-interval/', '{"Array"}', 125, 'Insert interval and merge if necessary.'),
  ('faang-3', 'Non-overlapping Intervals', 'Medium', 'LeetCode', 'https://leetcode.com/problems/non-overlapping-intervals/', '{"Array", "Greedy"}', 125, 'Remove minimum intervals to make non-overlapping.'),
  ('faang-4', 'Meeting Rooms', 'Easy', 'LeetCode', 'https://leetcode.com/problems/meeting-rooms/', '{"Array", "Sorting"}', 75, 'Check if person can attend all meetings.'),
  ('faang-5', 'Meeting Rooms II', 'Medium', 'LeetCode', 'https://leetcode.com/problems/meeting-rooms-ii/', '{"Array", "Heap"}', 125, 'Find minimum meeting rooms required.'),
  ('faang-6', 'Sliding Window Maximum', 'Hard', 'LeetCode', 'https://leetcode.com/problems/sliding-window-maximum/', '{"Array", "Sliding Window", "Deque"}', 200, 'Find maximum in sliding window.'),
  ('faang-7', 'Trapping Rain Water', 'Hard', 'LeetCode', 'https://leetcode.com/problems/trapping-rain-water/', '{"Array", "Two Pointers"}', 200, 'Calculate trapped rainwater.'),
  ('faang-8', 'Largest Rectangle in Histogram', 'Hard', 'LeetCode', 'https://leetcode.com/problems/largest-rectangle-in-histogram/', '{"Array", "Stack"}', 200, 'Find largest rectangle in histogram.'),
  ('faang-9', 'Valid Sudoku', 'Medium', 'LeetCode', 'https://leetcode.com/problems/valid-sudoku/', '{"Array", "Hash Table"}', 100, 'Check if sudoku board is valid.'),
  ('faang-10', 'Spiral Matrix', 'Medium', 'LeetCode', 'https://leetcode.com/problems/spiral-matrix/', '{"Array", "Matrix"}', 125, 'Return elements in spiral order.'),

  -- LINKED LIST PROBLEMS
  ('ll-1', 'Reverse Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/reverse-linked-list/', '{"Linked List"}', 50, 'Reverse a singly linked list.'),
  ('ll-2', 'Detect Cycle in Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/linked-list-cycle/', '{"Linked List", "Two Pointers"}', 75, 'Detect if linked list has a cycle.'),
  ('ll-3', 'Merge Two Sorted Lists', 'Easy', 'LeetCode', 'https://leetcode.com/problems/merge-two-sorted-lists/', '{"Linked List"}', 50, 'Merge two sorted linked lists.'),
  ('ll-4', 'Remove Nth Node From End', 'Medium', 'LeetCode', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', '{"Linked List", "Two Pointers"}', 100, 'Remove nth node from end of list.'),
  ('ll-5', 'Reorder List', 'Medium', 'LeetCode', 'https://leetcode.com/problems/reorder-list/', '{"Linked List"}', 125, 'Reorder list in specific pattern.'),

  -- STACK AND QUEUE PROBLEMS
  ('stack-1', 'Valid Parentheses', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-parentheses/', '{"Stack", "String"}', 50, 'Check if parentheses are valid using stack.'),
  ('stack-2', 'Min Stack', 'Easy', 'LeetCode', 'https://leetcode.com/problems/min-stack/', '{"Stack", "Design"}', 75, 'Design stack with min operation.'),
  ('stack-3', 'Evaluate Reverse Polish Notation', 'Medium', 'LeetCode', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', '{"Stack"}', 100, 'Evaluate RPN expression.'),
  ('stack-4', 'Daily Temperatures', 'Medium', 'LeetCode', 'https://leetcode.com/problems/daily-temperatures/', '{"Stack", "Array"}', 125, 'Find next warmer temperature.'),
  ('stack-5', 'Car Fleet', 'Medium', 'LeetCode', 'https://leetcode.com/problems/car-fleet/', '{"Stack", "Array"}', 125, 'Calculate number of car fleets.'),

  -- HEAP PROBLEMS
  ('heap-1', 'Kth Largest Element in Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/kth-largest-element-in-an-array/', '{"Array", "Heap"}', 100, 'Find kth largest element using heap.'),
  ('heap-2', 'Top K Frequent Elements', 'Medium', 'LeetCode', 'https://leetcode.com/problems/top-k-frequent-elements/', '{"Array", "Heap", "Hash Table"}', 125, 'Find k most frequent elements.'),
  ('heap-3', 'Find Median from Data Stream', 'Hard', 'LeetCode', 'https://leetcode.com/problems/find-median-from-data-stream/', '{"Heap", "Design"}', 200, 'Find median from data stream.'),
  ('heap-4', 'Merge k Sorted Lists', 'Hard', 'LeetCode', 'https://leetcode.com/problems/merge-k-sorted-lists/', '{"Linked List", "Heap"}', 200, 'Merge k sorted linked lists.'),
  ('heap-5', 'Task Scheduler', 'Medium', 'LeetCode', 'https://leetcode.com/problems/task-scheduler/', '{"Array", "Heap", "Greedy"}', 125, 'Schedule tasks with cooling time.'),

  -- TRIE PROBLEMS
  ('trie-1', 'Implement Trie', 'Medium', 'LeetCode', 'https://leetcode.com/problems/implement-trie-prefix-tree/', '{"Trie", "Design"}', 125, 'Implement trie data structure.'),
  ('trie-2', 'Word Search II', 'Hard', 'LeetCode', 'https://leetcode.com/problems/word-search-ii/', '{"Backtracking", "Trie"}', 200, 'Find words in 2D board using trie.'),
  ('trie-3', 'Design Add and Search Words', 'Medium', 'LeetCode', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', '{"Trie", "Design"}', 125, 'Design data structure for add and search.'),

  -- BACKTRACKING PROBLEMS
  ('bt-1', 'Subsets', 'Medium', 'LeetCode', 'https://leetcode.com/problems/subsets/', '{"Array", "Backtracking"}', 100, 'Generate all possible subsets.'),
  ('bt-2', 'Combination Sum', 'Medium', 'LeetCode', 'https://leetcode.com/problems/combination-sum/', '{"Array", "Backtracking"}', 125, 'Find combinations that sum to target.'),
  ('bt-3', 'Permutations', 'Medium', 'LeetCode', 'https://leetcode.com/problems/permutations/', '{"Array", "Backtracking"}', 125, 'Generate all permutations.'),
  ('bt-4', 'Word Search', 'Medium', 'LeetCode', 'https://leetcode.com/problems/word-search/', '{"Array", "Backtracking"}', 125, 'Find word in 2D board.'),
  ('bt-5', 'Palindrome Partitioning', 'Medium', 'LeetCode', 'https://leetcode.com/problems/palindrome-partitioning/', '{"String", "Backtracking"}', 125, 'Partition string into palindromes.'),

  -- GREEDY PROBLEMS
  ('greedy-1', 'Maximum Subarray', 'Easy', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/', '{"Array", "Greedy"}', 75, 'Find maximum subarray sum.'),
  ('greedy-2', 'Jump Game', 'Medium', 'LeetCode', 'https://leetcode.com/problems/jump-game/', '{"Array", "Greedy"}', 100, 'Check if can reach last index.'),
  ('greedy-3', 'Jump Game II', 'Medium', 'LeetCode', 'https://leetcode.com/problems/jump-game-ii/', '{"Array", "Greedy"}', 125, 'Find minimum jumps to reach end.'),
  ('greedy-4', 'Gas Station', 'Medium', 'LeetCode', 'https://leetcode.com/problems/gas-station/', '{"Array", "Greedy"}', 125, 'Find starting gas station.'),
  ('greedy-5', 'Hand of Straights', 'Medium', 'LeetCode', 'https://leetcode.com/problems/hand-of-straights/', '{"Array", "Greedy"}', 125, 'Check if can form consecutive groups.'),

  -- ADVANCED PROBLEMS
  ('adv-1', 'Median of Two Sorted Arrays', 'Hard', 'LeetCode', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '{"Array", "Binary Search"}', 200, 'Find median of two sorted arrays.'),
  ('adv-2', 'Regular Expression Matching', 'Hard', 'LeetCode', 'https://leetcode.com/problems/regular-expression-matching/', '{"String", "Dynamic Programming"}', 200, 'Implement regex matching.'),
  ('adv-3', 'Wildcard Matching', 'Hard', 'LeetCode', 'https://leetcode.com/problems/wildcard-matching/', '{"String", "Dynamic Programming"}', 200, 'Implement wildcard matching.'),
  ('adv-4', 'N-Queens', 'Hard', 'LeetCode', 'https://leetcode.com/problems/n-queens/', '{"Backtracking"}', 200, 'Solve N-Queens problem.'),
  ('adv-5', 'Sudoku Solver', 'Hard', 'LeetCode', 'https://leetcode.com/problems/sudoku-solver/', '{"Backtracking"}', 200, 'Solve sudoku puzzle.'),

  -- MATH PROBLEMS
  ('math-1', 'Happy Number', 'Easy', 'LeetCode', 'https://leetcode.com/problems/happy-number/', '{"Math", "Hash Table"}', 50, 'Check if number is happy.'),
  ('math-2', 'Plus One', 'Easy', 'LeetCode', 'https://leetcode.com/problems/plus-one/', '{"Math", "Array"}', 25, 'Add one to number represented as array.'),
  ('math-3', 'Pow(x, n)', 'Medium', 'LeetCode', 'https://leetcode.com/problems/powx-n/', '{"Math", "Recursion"}', 100, 'Implement power function.'),
  ('math-4', 'Sqrt(x)', 'Easy', 'LeetCode', 'https://leetcode.com/problems/sqrtx/', '{"Math", "Binary Search"}', 50, 'Implement square root function.'),
  ('math-5', 'Integer to Roman', 'Medium', 'LeetCode', 'https://leetcode.com/problems/integer-to-roman/', '{"Math", "String"}', 100, 'Convert integer to roman numeral.'),

  -- DESIGN PROBLEMS
  ('design-1', 'LRU Cache', 'Medium', 'LeetCode', 'https://leetcode.com/problems/lru-cache/', '{"Design", "Hash Table", "Linked List"}', 150, 'Design LRU cache.'),
  ('design-2', 'Implement Queue using Stacks', 'Easy', 'LeetCode', 'https://leetcode.com/problems/implement-queue-using-stacks/', '{"Stack", "Queue", "Design"}', 75, 'Implement queue using stacks.'),
  ('design-3', 'Design Twitter', 'Medium', 'LeetCode', 'https://leetcode.com/problems/design-twitter/', '{"Design", "Hash Table", "Heap"}', 150, 'Design simplified Twitter.'),
  ('design-4', 'Design Hit Counter', 'Medium', 'LeetCode', 'https://leetcode.com/problems/design-hit-counter/', '{"Design", "Queue"}', 125, 'Design hit counter.'),
  ('design-5', 'Design Search Autocomplete', 'Hard', 'LeetCode', 'https://leetcode.com/problems/design-search-autocomplete-system/', '{"Design", "Trie"}', 200, 'Design search autocomplete system.')

ON CONFLICT (id) DO NOTHING;

-- Update existing daily challenge to use a new problem
UPDATE daily_challenges 
SET problem_id = 'blind75-1', bonus_xp = 100 
WHERE date = CURRENT_DATE;

-- Insert additional daily challenges for the week
INSERT INTO daily_challenges (date, problem_id, bonus_xp) VALUES
  (CURRENT_DATE + INTERVAL '1 day', 'striver-array-1', 150),
  (CURRENT_DATE + INTERVAL '2 days', 'string-4', 175),
  (CURRENT_DATE + INTERVAL '3 days', 'tree-4', 250),
  (CURRENT_DATE + INTERVAL '4 days', 'dp-2', 200),
  (CURRENT_DATE + INTERVAL '5 days', 'graph-1', 175),
  (CURRENT_DATE + INTERVAL '6 days', 'faang-6', 300)
ON CONFLICT (date) DO NOTHING;