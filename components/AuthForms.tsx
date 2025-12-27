
import React, { useState } from 'react';
import { db } from '../services/database';
import { User } from '../types';
import { Loader2, Mail, Lock, User as UserIcon, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthFormsProps {
  mode: 'login' | 'signup' | 'forgot';
  onAuthSuccess: (user: User) => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ mode, onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: verify email, 2: new password
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetNavigation = (path: string) => {
    setError('');
    setSuccessMsg('');
    setResetStep(1);
    window.location.hash = path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const existing = db.findUserByEmail(formData.email);
        if (existing) {
          setError('User with this email already exists.');
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString()
        };

        await db.saveUser(newUser);
        onAuthSuccess(newUser);
      } else if (mode === 'login') {
        const user = db.findUserByEmail(formData.email);
        if (user && user.password === formData.password) {
          onAuthSuccess(user);
        } else {
          setError('Invalid email or password.');
        }
      } else if (mode === 'forgot') {
        if (resetStep === 1) {
          const user = db.findUserByEmail(formData.email);
          if (user) {
            setResetStep(2);
          } else {
            setError('No account found with this email address.');
          }
        } else {
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
          }
          const success = await db.updateUserPassword(formData.email, formData.password);
          if (success) {
            setSuccessMsg('Password updated successfully! Redirecting to login...');
            setTimeout(() => handleResetNavigation('/login'), 2000);
          } else {
            setError('Failed to update password. Please try again.');
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
    if (mode === 'login') return 'Welcome Back';
    if (mode === 'signup') return 'Join GIRM Hospital';
    return 'Reset Password';
  };

  const renderSubtitle = () => {
    if (mode === 'login') return "Access your patient portal and appointments";
    if (mode === 'signup') return "Create an account for personalized healthcare";
    if (resetStep === 1) return "Enter your email to verify your identity";
    return "Create a strong new password for your account";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          {mode === 'forgot' && (
            <button 
              onClick={() => handleResetNavigation('/login')}
              className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
          )}
          <h2 className="text-3xl font-extrabold text-slate-900">
            {renderTitle()}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {renderSubtitle()}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium border border-green-100">
            {successMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                />
              </div>
            )}
            
            {(mode !== 'forgot' || resetStep === 1) && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  type="email"
                  disabled={mode === 'forgot' && resetStep === 2}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Email Address"
                />
              </div>
            )}

            {(mode !== 'forgot' || resetStep === 2) && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={mode === 'forgot' ? "New Password" : "Password"}
                />
              </div>
            )}

            {mode === 'forgot' && resetStep === 2 && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm New Password"
                />
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleResetNavigation('/forgot')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            disabled={loading || !!successMsg}
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>
              {mode === 'login' && 'Login'}
              {mode === 'signup' && 'Sign Up'}
              {mode === 'forgot' && (resetStep === 1 ? 'Verify Email' : 'Reset Password')}
            </span>
          </button>

          {mode !== 'forgot' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => handleResetNavigation(mode === 'login' ? '/signup' : '/login')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForms;
