/*
  # Add Coding Problems and Submissions Tables

  1. New Tables
    - `coding_problems` - Store coding problems from various platforms
    - `problem_submissions` - Track user submissions and solutions
    - `daily_challenges` - Daily coding challenges
    - `coding_streaks` - Track user coding streaks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create coding_problems table
CREATE TABLE IF NOT EXISTS coding_problems (
  id text PRIMARY KEY,
  title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  platform text NOT NULL CHECK (platform IN ('LeetCode', 'GeeksforGeeks', 'CodeChef')),
  url text NOT NULL,
  tags text[] DEFAULT '{}',
  xp integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create problem_submissions table
CREATE TABLE IF NOT EXISTS problem_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id text REFERENCES coding_problems(id) ON DELETE CASCADE,
  solved boolean DEFAULT false,
  time_spent integer, -- in minutes
  solution_code text,
  language text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  problem_id text REFERENCES coding_problems(id) ON DELETE CASCADE,
  bonus_xp integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Create coding_streaks table
CREATE TABLE IF NOT EXISTS coding_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_solved_date date,
  total_problems_solved integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies for coding_problems (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read coding problems"
  ON coding_problems
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for problem_submissions
CREATE POLICY "Users can manage own submissions"
  ON problem_submissions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for daily_challenges (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read daily challenges"
  ON daily_challenges
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for coding_streaks
CREATE POLICY "Users can manage own coding streaks"
  ON coding_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample coding problems
INSERT INTO coding_problems (id, title, difficulty, platform, url, tags, xp, description) VALUES
  -- LeetCode Problems
  ('lc-1', 'Two Sum', 'Easy', 'LeetCode', 'https://leetcode.com/problems/two-sum/', '{"Array", "Hash Table"}', 50, 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'),
  ('lc-2', 'Add Two Numbers', 'Medium', 'LeetCode', 'https://leetcode.com/problems/add-two-numbers/', '{"Linked List", "Math"}', 100, 'You are given two non-empty linked lists representing two non-negative integers.'),
  ('lc-3', 'Longest Substring Without Repeating Characters', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '{"Hash Table", "String", "Sliding Window"}', 100, 'Given a string s, find the length of the longest substring without repeating characters.'),
  ('lc-4', 'Median of Two Sorted Arrays', 'Hard', 'LeetCode', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '{"Array", "Binary Search", "Divide and Conquer"}', 200, 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.'),
  ('lc-5', 'Longest Palindromic Substring', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-palindromic-substring/', '{"String", "Dynamic Programming"}', 100, 'Given a string s, return the longest palindromic substring in s.'),
  
  -- GeeksforGeeks Problems
  ('gfg-1', 'Array Rotation', 'Easy', 'GeeksforGeeks', 'https://www.geeksforgeeks.org/array-rotation/', '{"Array", "Rotation"}', 50, 'Write a function rotate(ar[], d, n) that rotates arr[] of size n by d elements.'),
  ('gfg-2', 'Kadanes Algorithm', 'Medium', 'GeeksforGeeks', 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', '{"Array", "Dynamic Programming"}', 100, 'Find the sum of contiguous subarray within a one-dimensional array of numbers that has the largest sum.'),
  ('gfg-3', 'Binary Tree Traversal', 'Easy', 'GeeksforGeeks', 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/', '{"Tree", "DFS"}', 50, 'Implement inorder, preorder and postorder traversals of a binary tree.'),
  ('gfg-4', 'Graph BFS and DFS', 'Medium', 'GeeksforGeeks', 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/', '{"Graph", "BFS", "DFS"}', 100, 'Implement Breadth First Search and Depth First Search for a graph.'),
  ('gfg-5', 'Dynamic Programming - Coin Change', 'Hard', 'GeeksforGeeks', 'https://www.geeksforgeeks.org/coin-change-dp-7/', '{"Dynamic Programming"}', 200, 'Given a value N, find the number of ways to make change for N cents.'),
  
  -- CodeChef Problems
  ('cc-1', 'Life, the Universe, and Everything', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/TEST', '{"Basic Programming"}', 50, 'Your program must read integers from input until it reads the number 42.'),
  ('cc-2', 'ATM', 'Easy', 'CodeChef', 'https://www.codechef.com/problems/HS08TEST', '{"Basic Programming"}', 50, 'Pooja would like to withdraw X $US from an ATM.'),
  ('cc-3', 'Chef and Notebooks', 'Medium', 'CodeChef', 'https://www.codechef.com/problems/CNOTE', '{"Implementation"}', 100, 'Chef wants to buy a new notebook for his recipes.'),
  ('cc-4', 'Sereja and Dima', 'Medium', 'CodeChef', 'https://www.codechef.com/problems/SEALUP', '{"Greedy", "Game Theory"}', 100, 'Sereja and Dima play a game with a sequence of numbers.'),
  ('cc-5', 'Chef and String', 'Hard', 'CodeChef', 'https://www.codechef.com/problems/CHEFSTR1', '{"String", "Implementation"}', 200, 'Chef has a string S consisting of lowercase English letters.');

-- Create trigger for coding_streaks updated_at
CREATE TRIGGER update_coding_streaks_updated_at 
  BEFORE UPDATE ON coding_streaks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert today's daily challenge
INSERT INTO daily_challenges (date, problem_id, bonus_xp) VALUES
  (CURRENT_DATE, 'lc-1', 100);