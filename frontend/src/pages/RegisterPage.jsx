import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Gavel, Mail, Lock, ShieldCheck, User, ArrowRight, Shield, Zap, Key, Building2, Contact, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, tenantId } = useAuth(); // Using register properly now

  const [role, setRole] = useState('BIDDER'); // BIDDER or SELLER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the Terms of Service to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await register(role, name, email, password, company, tenantId || 'tenant-alpha');
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
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="text-white">Register</Link>
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
        <div className="w-full max-w-[480px] bg-[#161616] border border-[#2A2A2A] rounded-[24px] p-8 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-[12px] bg-brand text-[#121212] flex items-center justify-center font-bold mb-5 shadow-soft-sm relative">
              <Gavel className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand border-2 border-[#161616]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
              Join BidPulse to bid in real-time or manage your consignments.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button 
              type="button"
              onClick={() => setRole('BIDDER')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-colors ${
                role === 'BIDDER' ? 'bg-brand text-[#121212]' : 'bg-[#0D0D0D] border border-[#2A2A2A] text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Bidder
            </button>
            <button 
              type="button"
              onClick={() => setRole('SELLER')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-colors ${
                role === 'SELLER' ? 'bg-brand text-[#121212]' : 'bg-[#0D0D0D] border border-[#2A2A2A] text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> Consignor / Seller
            </button>
          </div>



          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Contact className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Alexandra Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Work / Personal Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">Password</label>
                <span className="text-[10px] font-mono text-slate-500">At least 8 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-brand transition-colors"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </div>
              </div>
            </div>

            {role === 'SELLER' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">Company / Organization</label>
                  <span className="text-[10px] font-mono text-slate-500">Optional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Vanguard Art Partners LLC"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 pt-2 pb-2" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div className="mt-0.5">
                <div className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${termsAccepted ? 'bg-brand border-brand text-dark-bg' : 'border-[#2A2A2A] bg-[#0D0D0D]'}`}>
                  {termsAccepted && <CheckCircle2 className="w-3 h-3" />}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">
                I agree to the <span className="text-slate-300">Terms of Service</span>, <span className="text-slate-300">Settlement Rules</span>, and <span className="text-slate-300">Privacy Policy</span>.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold py-3 text-sm rounded-full shadow-yellow-glow"
              isLoading={isSubmitting}
            >
              Create Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-8 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-slate-300" /> Zero-Knowledge Vault</span>
          <span className="text-[#2A2A2A]">•</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-slate-300" /> Sub-Millisecond Engine</span>
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
