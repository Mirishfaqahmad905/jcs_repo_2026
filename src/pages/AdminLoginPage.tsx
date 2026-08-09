import React, { useState } from 'react';
import { CollegeLogo } from '../components/CollegeLogo';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../services/api';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('jamal');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginAdmin(username.trim(), password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Invalid username or password!');
      }
    } catch (err) {
      setErrorMsg('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />

      {/* Back to Site Button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 transition-all z-10"
      >
        <ArrowRight className="w-4 h-4 text-blue-400 rotate-180" />
        <span>Public Website</span>
      </button>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-left">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-slate-800">
          <CollegeLogo size="lg" showText={false} />
          <div>
            <h2 className="text-2xl font-black text-white">Jamal College Admin Portal</h2>
            <p className="text-xs text-blue-200/80 font-semibold mt-1">
              Jamal College of Sciences - Administrative Portal
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/50 p-3.5 rounded-xl text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Security Notice Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-100 text-xs text-center">
          <p className="font-bold text-blue-300">Administrative Portal Authorization</p>
          <p className="text-[11px] text-slate-300 mt-1">Please enter your username and password to log in.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-medium pl-10"
              />
              <User className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-medium pl-10 pr-10"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{loading ? 'Logging in...' : 'Admin Login'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
