import { supabase } from '../lib/supabase';
import { User } from '../types';

export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Profile service error:', error);
      throw error;
    }
  },

  async createProfile(profile: Omit<User, 'id' | 'lastActivity'> & { user_id: string }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: profile.user_id,
          name: profile.name,
          email: profile.email,
          degree: profile.degree,
          branch: profile.branch,
          year: profile.year,
          interests: profile.interests,
          career_goal: profile.careerGoal,
          avatar: profile.avatar,
          level: profile.level,
          xp: profile.xp,
          tier: profile.tier,
          streak: profile.streak,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      // Initialize career stats with error handling
      try {
        await supabase
          .from('career_stats')
          .upsert({
            user_id: profile.user_id,
            knowledge: 0,
            mindset: 0,
            communication: 0,
            portfolio: 0,
          }, {
            onConflict: 'user_id'
          });
      } catch (statsError) {
        console.warn('Error initializing career stats:', statsError);
        // Don't throw here as profile creation was successful
      }

      return data;
    } catch (error) {
      console.error('Profile creation error:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          email: updates.email,
          degree: updates.degree,
          branch: updates.branch,
          year: updates.year,
          interests: updates.interests,
          career_goal: updates.careerGoal,
          avatar: updates.avatar,
          level: updates.level,
          xp: updates.xp,
          tier: updates.tier,
          streak: updates.streak,
          last_activity: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  async getCareerStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('career_stats')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        console.error('Error fetching career stats:', error);
        // Return default stats instead of throwing
        return { knowledge: 0, mindset: 0, communication: 0, portfolio: 0 };
      }

      return data && data.length > 0 ? data[0] : { knowledge: 0, mindset: 0, communication: 0, portfolio: 0 };
    } catch (error) {
      console.error('Career stats service error:', error);
      // Return default stats as fallback
      return { knowledge: 0, mindset: 0, communication: 0, portfolio: 0 };
    }
  },

  async updateCareerStats(userId: string, stats: { knowledge?: number; mindset?: number; communication?: number; portfolio?: number }) {
    try {
      const { data, error } = await supabase
        .from('career_stats')
        .upsert({
          user_id: userId,
          ...stats,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating career stats:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Career stats update error:', error);
      throw error;
    }
  },

  // Utility function to check if profile exists
  async profileExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        console.error('Error checking profile existence:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Profile existence check error:', error);
      return false;
    }
  },

  // Utility function to get profile with fallback
  async getProfileWithFallback(userId: string) {
    try {
      const profile = await this.getProfile(userId);
      
      if (!profile) {
        // Return a default profile structure
        return {
          user_id: userId,
          name: 'New User',
          email: '',
          degree: '',
          branch: '',
          year: 1,
          interests: [],
          career_goal: '',
          avatar: '',
          level: 1,
          xp: 0,
          tier: 'Bronze',
          streak: 0,
          last_activity: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      return profile;
    } catch (error) {
      console.error('Error getting profile with fallback:', error);
      // Return minimal profile structure
      return {
        user_id: userId,
        name: 'New User',
        email: '',
        degree: '',
        branch: '',
        year: 1,
        interests: [],
        career_goal: '',
        avatar: '',
        level: 1,
        xp: 0,
        tier: 'Bronze',
        streak: 0,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },
};