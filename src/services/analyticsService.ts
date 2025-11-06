import { supabase } from '../lib/supabase';
import { PerformanceMetrics } from '../types';

export class AnalyticsService {
  static async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    try {
      const [
        dailyXP,
        weeklyProgress,
        monthlyGrowth,
        skillProgression
      ] = await Promise.all([
        this.getDailyXPData(userId),
        this.getWeeklyProgressData(userId),
        this.getMonthlyGrowthData(userId),
        this.getSkillProgressionData(userId)
      ]);

      const productivityScore = this.calculateProductivityScore(dailyXP);
      const consistencyScore = this.calculateConsistencyScore(dailyXP);
      const learningVelocity = this.calculateLearningVelocity(skillProgression);

      return {
        dailyXP,
        weeklyProgress,
        monthlyGrowth,
        skillProgression,
        productivityScore,
        consistencyScore,
        learningVelocity,
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  private static async getDailyXPData(userId: string) {
    const { data, error } = await supabase
      .from('xp_transactions')
      .select('amount, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const dailyData: { [key: string]: { xp: number; tasks: number } } = {};
    
    data?.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { xp: 0, tasks: 0 };
      }
      dailyData[date].xp += transaction.amount;
      if (transaction.amount > 0) {
        dailyData[date].tasks += 1;
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      xp: data.xp,
      tasks: data.tasks,
    }));
  }

  private static async getWeeklyProgressData(userId: string) {
    // Get last 12 weeks of data
    const weeks = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const { data: xpData } = await supabase
        .from('xp_transactions')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      const { data: taskData } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', weekStart.toISOString())
        .lte('updated_at', weekEnd.toISOString());

      const { data: problemData } = await supabase
        .from('problem_submissions')
        .select('id')
        .eq('user_id', userId)
        .eq('solved', true)
        .gte('submitted_at', weekStart.toISOString())
        .lte('submitted_at', weekEnd.toISOString());

      weeks.push({
        week: `Week ${12 - i}`,
        xp: xpData?.reduce((sum, t) => sum + t.amount, 0) || 0,
        tasks: taskData?.length || 0,
        problems: problemData?.length || 0,
      });
    }

    return weeks;
  }

  private static async getMonthlyGrowthData(userId: string) {
    // Get last 6 months of data
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('user_id', userId)
        .single();

      months.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        level: profile?.level || 1,
        xp: profile?.xp || 0,
      });
    }

    return months;
  }

  private static async getSkillProgressionData(userId: string) {
    // Mock skill progression data
    const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'System Design'];
    return skills.map(skill => ({
      skill,
      level: Math.floor(Math.random() * 5) + 1,
      xp: Math.floor(Math.random() * 500) + 100,
      date: new Date().toISOString(),
    }));
  }

  private static calculateProductivityScore(dailyXP: any[]): number {
    if (dailyXP.length === 0) return 0;
    
    const avgXP = dailyXP.reduce((sum, day) => sum + day.xp, 0) / dailyXP.length;
    const activeDays = dailyXP.filter(day => day.xp > 0).length;
    const consistencyRatio = activeDays / dailyXP.length;
    
    return Math.round((avgXP / 100) * consistencyRatio * 100);
  }

  private static calculateConsistencyScore(dailyXP: any[]): number {
    if (dailyXP.length === 0) return 0;
    
    const activeDays = dailyXP.filter(day => day.xp > 0).length;
    return Math.round((activeDays / dailyXP.length) * 100);
  }

  private static calculateLearningVelocity(skillProgression: any[]): number {
    return Math.round(skillProgression.reduce((sum, skill) => sum + skill.level, 0) / skillProgression.length * 20);
  }

  private static getDefaultMetrics(): PerformanceMetrics {
    return {
      dailyXP: [],
      weeklyProgress: [],
      monthlyGrowth: [],
      skillProgression: [],
      productivityScore: 0,
      consistencyScore: 0,
      learningVelocity: 0,
    };
  }

  // Real-time analytics tracking
  static async trackEvent(userId: string, eventType: string, metadata: any = {}) {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          metadata,
          timestamp: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Generate insights based on user data
  static async generateInsights(userId: string) {
    const metrics = await this.getPerformanceMetrics(userId);
    const insights = [];

    // Productivity insights
    if (metrics.productivityScore < 50) {
      insights.push({
        type: 'improvement',
        title: 'Boost Your Productivity',
        message: 'Try setting smaller, achievable daily goals to build momentum.',
        priority: 'medium',
      });
    }

    // Consistency insights
    if (metrics.consistencyScore < 70) {
      insights.push({
        type: 'habit',
        title: 'Build Better Habits',
        message: 'Aim for at least 15 minutes of learning daily to improve consistency.',
        priority: 'high',
      });
    }

    // Learning velocity insights
    if (metrics.learningVelocity > 80) {
      insights.push({
        type: 'achievement',
        title: 'Excellent Learning Pace!',
        message: 'You\'re learning at an exceptional rate. Consider taking on harder challenges.',
        priority: 'low',
      });
    }

    return insights;
  }
}