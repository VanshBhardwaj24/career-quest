import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session with proper error handling
    const getSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setError('Failed to get session');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      try {
        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
          
          // Only set loading to false after initial load
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        if (mounted) {
          setError('Authentication state error');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
        return { data: null, error };
      }

      console.log('Sign up successful:', data.user?.email);
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred during sign up';
      setError(errorMessage);
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        return { data: null, error };
      }

      console.log('Sign in successful:', data.user?.email);
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred during sign in';
      setError(errorMessage);
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setError(error.message);
        return { error };
      }

      console.log('Sign out successful');
      setUser(null);
      return { error: null };
    } catch (error: any) {
      console.error('Sign out exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred during sign out';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      
      if (error) {
        console.error('Reset password error:', error);
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Reset password exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}