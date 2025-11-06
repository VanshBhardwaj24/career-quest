import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, Trophy, Target, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp, signIn, loading: authLoading, error: authError, resetPassword } = useAuth();

  const loading = localLoading || authLoading;
  const error = localError || authError;

  const validateForm = () => {
    setLocalError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setLocalError('Email is required');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }

    if (isSignUp && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    setLocalError('');

    try {
      const { error } = isSignUp
        ? await signUp(email.trim(), password)
        : await signIn(email.trim(), password);

      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMessage(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setLocalError(err.message || 'An unexpected error occurred');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setLocalError('Please enter your email address first');
      return;
    }

    setLocalLoading(true);
    setLocalError('');

    try {
      const { error } = await resetPassword(email.trim());
      
      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send reset email');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@careerquest.com');
    setPassword('demo123');
    setLocalLoading(true);
    setLocalError('');

    try {
      // First, try to create the demo user if it doesn't exist
      const { error: signUpError } = await signUp('demo@careerquest.com', 'demo123');
      
      // If sign up fails with "User already registered", that's fine - user exists
      if (signUpError && !signUpError.message.includes('User already registered')) {
        console.log('Demo user creation failed:', signUpError.message);
      }
      
      // Now attempt to sign in with the demo credentials
      const { error } = await signIn('demo@careerquest.com', 'demo123');
      
      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMessage('Demo login successful!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Demo login failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: 'Gamified Learning Experience' },
    { icon: Trophy, text: 'Unlock Achievements & Badges' },
    { icon: Target, text: 'Track Your Career Progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Career Quest
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your career journey into an epic adventure. Level up your skills, unlock achievements, and reach your dream job!
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Join the Quest' : 'Welcome Back!'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Start your career adventure today' : 'Continue your journey to success'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  disabled={loading}
                 aria-label="Email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  disabled={loading}
                 aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setLocalError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    disabled={loading}
                   aria-label="Confirm password"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-green-600 text-sm">{successMessage}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                isSignUp ? 'Start Your Quest' : 'Continue Quest'
              )}
            </motion.button>
          </form>

          {/* Forgot Password */}
          {!isSignUp && (
            <div className="mt-4 text-center">
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Toggle Sign Up/In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLocalError('');
                setSuccessMessage('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              disabled={loading}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Join the quest"}
            </button>
          </div>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleDemoLogin}
              disabled={loading}
              className="mt-4 w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
            >
              {loading ? 'Loading...' : 'Try Demo Account'}
            </motion.button>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center mb-2 font-medium">Demo Credentials:</p>
            <div className="text-xs text-gray-500 space-y-1 text-center">
              <div>Email: demo@careerquest.com</div>
              <div>Password: demo123</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}