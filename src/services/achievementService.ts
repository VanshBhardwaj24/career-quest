import { supabase } from '../lib/supabase';
import { Achievement } from '../types';

export const achievementService = {
  async getAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('tier', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        unlocked_at,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const unlockedIds = new Set(data.map(ua => ua.achievement_id));
    
    // Get all achievements and mark which ones are unlocked
    const allAchievements = await this.getAchievements();
    
    return allAchievements.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: data.find(ua => ua.achievement_id === achievement.id)?.unlocked_at 
        ? new Date(data.find(ua => ua.achievement_id === achievement.id)!.unlocked_at)
        : undefined,
      tier: achievement.tier as 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic',
      xp: achievement.xp,
    }));
  },

  async unlockAchievement(userId: string, achievementId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error;
    }

    return data;
  },
};