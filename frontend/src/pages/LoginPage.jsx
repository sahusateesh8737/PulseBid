import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Gavel, Mail, Lock, ShieldCheck, User, ArrowRight, ArrowUpRight, Zap, Key } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, tenantId } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Defaulting to tenantId for MVP since we removed the tenant selector
    const result = await login(email, password, tenantId || 'tenant-alpha');
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-slate-100 font-sans selection:bg-brand selection:text-dark-bg relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Custom Auth Header */}
      <header className="flex items-center justify-between px-6 py-5 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
             <div className="w-5 h-5 rounded flex items-center justify-center bg-brand text-dark-bg font-bold">
               <Gavel className="w-3.5 h-3.5" />
             </div>
             <span className="font-extrabold text-xl tracking-tight text-white">BidPulse</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-dark-border" />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-dark-border text-[10px] font-mono text-slate-300 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" /> CORE AUTH TERMINAL
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link to="/login" className="text-white">Sign In</Link>
          <Link to="/signup" className="text-slate-400 hover:text-white transition-colors">Register</Link>
          <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Recovery</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dark-border text-[10px] font-mono text-slate-300 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" /> TLS 1.3 VERIFIED
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-dark-border flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center z-10 p-4">
        <div className="w-full max-w-[440px] bg-[#161616] border border-[#2A2A2A] rounded-[24px] p-8 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#222222] text-brand border border-[#2A2A2A] flex items-center justify-center font-bold mb-4 shadow-soft-sm">
              <Gavel className="w-5 h-5" />
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[9px] font-mono text-brand uppercase tracking-widest mb-4 font-bold">
              Settlement Gateway
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sign in to BidPulse</h1>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
              Welcome back! Enter your credentials to access live auctions.
            </p>
          </div>

          <div className="flex items-center p-1 bg-[#0D0D0D] rounded-xl border border-[#2A2A2A] mb-8">
            <div className="flex-1 py-2 text-center text-sm font-bold text-white bg-[#222222] rounded-lg shadow-sm border border-[#2A2A2A]">
              Sign In
            </div>
            <Link to="/signup" className="flex-1 py-2 text-center text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
              Register
            </Link>
          </div>



          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300">Email address</label>
                <span className="text-[10px] font-mono text-slate-500">Required</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300">Password</label>
                <span className="text-[10px] font-mono text-brand cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-brand transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-500 hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-[#2A2A2A] bg-[#0D0D0D] flex items-center justify-center group-hover:border-brand">
                  <div className="w-2 h-2 rounded-sm bg-brand" />
                </div>
                <span className="text-[11px] text-slate-400">Remember this workstation</span>
              </label>
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand" /> 256-Bit Encrypted
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold py-3 text-sm rounded-xl"
              isLoading={isSubmitting}
            >
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center text-[11px] text-slate-400 pt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand font-bold hover:underline inline-flex items-center">
              Sign up <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-8 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand" /> Sub-10ms Ledger Feed</span>
          <span className="text-[#2A2A2A]">•</span>
          <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-brand" /> Passkey Enabled</span>
        </div>
      </main>

      {/* Custom Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-6 border-t border-dark-border text-[10px] text-slate-400 font-mono z-10 bg-dark-bg mt-auto">
        <div className="flex items-center gap-2">
          <span>© 2025 BidPulse Engine Inc.</span>
          <span className="text-[#2A2A2A] mx-2">•</span>
          <span className="uppercase tracking-widest">Zero-Latency Settlement Terminal</span>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <span className="cursor-pointer hover:text-slate-200">Security Protocols</span>
          <span className="cursor-pointer hover:text-slate-200">Terms of Execution</span>
          <span className="cursor-pointer hover:text-slate-200">Latency Monitor</span>
        </div>
      </footer>
    </div>
  );
};
