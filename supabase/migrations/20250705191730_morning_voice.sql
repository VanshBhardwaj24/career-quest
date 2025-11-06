/*
  # Initial Schema for Career Quest Platform

  1. New Tables
    - `profiles` - User profile information
    - `tasks` - User tasks and todos
    - `achievements` - Achievement definitions and user unlocks
    - `milestones` - Career milestones and progress
    - `career_stats` - User career statistics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  degree text NOT NULL,
  branch text NOT NULL,
  year integer NOT NULL,
  interests text[] DEFAULT '{}',
  career_goal text NOT NULL,
  avatar text DEFAULT '',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  tier text DEFAULT 'Bronze',
  streak integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text NOT NULL CHECK (priority IN ('Elite', 'Core', 'Bonus')),
  completed boolean DEFAULT false,
  xp integer DEFAULT 0,
  category text NOT NULL,
  due_date timestamptz,
  streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'mythic')),
  xp integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table for tracking unlocked achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  xp integer NOT NULL,
  estimated_hours integer NOT NULL,
  dependencies text[] DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('knowledge', 'mindset', 'communication', 'portfolio')),
  created_at timestamptz DEFAULT now()
);

-- Create user_milestones table for tracking user progress
CREATE TABLE IF NOT EXISTS user_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id text REFERENCES milestones(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, milestone_id)
);

-- Create career_stats table
CREATE TABLE IF NOT EXISTS career_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  knowledge integer DEFAULT 0,
  mindset integer DEFAULT 0,
  communication integer DEFAULT 0,
  portfolio integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for achievements (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can manage own achievement unlocks"
  ON user_achievements
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for milestones (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_milestones
CREATE POLICY "Users can manage own milestone progress"
  ON user_milestones
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for career_stats
CREATE POLICY "Users can manage own career stats"
  ON career_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (id, title, description, icon, tier, xp) VALUES
  ('first-resume', 'First Resume Upload', 'Upload your first resume to the platform', '📄', 'bronze', 100),
  ('30-days-active', '30 Days Active', 'Stay active for 30 consecutive days', '🔥', 'silver', 500),
  ('dsa-100', 'DSA Master', 'Complete 100 DSA problems', '🧠', 'gold', 1000),
  ('first-internship', 'First Internship', 'Land your first internship', '🎯', 'platinum', 2000),
  ('profile-complete', 'Profile Complete', 'Complete your profile setup', '✅', 'bronze', 50),
  ('first-task', 'Task Master', 'Complete your first task', '📝', 'bronze', 75),
  ('week-streak', 'Week Warrior', 'Maintain a 7-day streak', '⚡', 'silver', 300),
  ('level-up', 'Level Up', 'Reach level 5', '🚀', 'gold', 750);

-- Insert default milestones
INSERT INTO milestones (id, title, description, xp, estimated_hours, dependencies, category) VALUES
  ('profile-setup', 'Complete Profile Setup', 'Set up your profile with degree, interests, and career goals', 100, 1, '{}', 'portfolio'),
  ('resume-creation', 'Create Professional Resume', 'Build and optimize your resume for target roles', 200, 4, '{"profile-setup"}', 'portfolio'),
  ('linkedin-optimization', 'Optimize LinkedIn Profile', 'Complete and optimize your LinkedIn profile', 150, 2, '{"profile-setup"}', 'communication'),
  ('github-cleanup', 'GitHub Portfolio Cleanup', 'Organize and showcase your best repositories', 200, 3, '{"profile-setup"}', 'portfolio'),
  ('dsa-foundation', 'DSA Foundation', 'Complete 50 basic DSA problems', 300, 20, '{"profile-setup"}', 'knowledge'),
  ('mock-interview', 'First Mock Interview', 'Complete your first mock interview session', 250, 2, '{"resume-creation", "linkedin-optimization"}', 'communication');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_milestones_updated_at BEFORE UPDATE ON user_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_stats_updated_at BEFORE UPDATE ON career_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();