import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { LiveIndicator } from './LiveIndicator';
import {
  Gavel,
  ShieldAlert,
  LogOut,
  Building2,
  ChevronDown,
  User,
  Sun,
  Moon,
  Bell,
  Menu,
  Sparkles,
  Layers,
  Settings,
  Radio,
} from 'lucide-react';

export const Navbar = ({ onOpenMobileSidebar }) => {
  const { user, isAuthenticated, logout, activeTenant, tenants, switchTenant, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { connectionStatus } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: '1', title: 'Outbid Alert', desc: 'Someone placed a higher bid on RTX 4090', time: '2m ago' },
    { id: '2', title: 'Auction Winner', desc: 'You reserved Apple MacBook Pro M3', time: '1h ago' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark-surface/90 border-b border-dark-border sticky top-0 z-40 backdrop-blur-md w-full">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left Brand & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={onOpenMobileSidebar}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-zinc-800"
                aria-label="Open Mobile Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-brand text-dark-bg flex items-center justify-center font-bold tracking-tighter shadow-soft-sm shadow-brand/20 group-hover:scale-105 transition-transform shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-100 group-hover:text-brand transition-colors">
                  Pulse<span className="text-brand">Bid</span>
                </span>
              </div>
            </Link>

            {/* Tenant Namespace Switcher */}
            {isAuthenticated && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-300 hover:text-white hover:border-brand/40 transition-all shadow-soft-sm"
                  aria-label="Tenant organization dropdown"
                  aria-expanded={tenantDropdownOpen}
                >
                  <Building2 className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span className="font-mono font-bold truncate max-w-[140px]">{activeTenant?.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {tenantDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setTenantDropdownOpen(false)} />
                    <div className="absolute left-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-2xl shadow-soft-lg z-50 py-2 font-sans">
                      <div className="px-4 py-1.5 border-b border-dark-border text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Switch Tenant Namespace
                      </div>
                      {tenants.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            switchTenant(t.id);
                            setTenantDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-zinc-800/60 transition-colors ${
                            activeTenant?.id === t.id ? 'text-brand font-bold bg-zinc-800/40' : 'text-slate-300'
                          }`}
                        >
                          <span>{t.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 uppercase">{t.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Utilities: Connection Status Pill, Theme Toggle, Notifications, User Avatar */}
          <div className="flex items-center gap-3">
            {/* Live Socket Connection Pill */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-xs font-mono">
                <Radio
                  className={`w-3.5 h-3.5 ${
                    connectionStatus === 'connected'
                      ? 'text-emerald-400 animate-pulse'
                      : connectionStatus === 'reconnecting'
                      ? 'text-amber-400 animate-spin'
                      : 'text-red-400'
                  }`}
                />
                <span className={`capitalize font-bold ${
                  connectionStatus === 'connected'
                    ? 'text-emerald-400'
                    : connectionStatus === 'reconnecting'
                    ? 'text-amber-300'
                    : 'text-red-400'
                }`}>
                  {connectionStatus}
                </span>
              </div>
            )}

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-dark-card border border-dark-border text-slate-400 hover:text-brand hover:border-brand/40 transition-all shadow-soft-sm"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notifications Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-full bg-dark-card border border-dark-border text-slate-400 hover:text-brand hover:border-brand/40 transition-all shadow-soft-sm relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-72 bg-dark-card border border-dark-border rounded-2xl shadow-soft-lg z-50 p-3 font-sans">
                      <div className="px-2 py-1 border-b border-dark-border text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>Live Notifications</span>
                        <Badge variant="brand" size="sm">2 New</Badge>
                      </div>
                      <div className="divide-y divide-dark-border/60 max-h-60 overflow-y-auto">
                        {mockNotifications.map((n) => (
                          <div key={n.id} className="py-2.5 px-2 hover:bg-zinc-800/40 rounded-xl transition-colors">
                            <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{n.desc}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1">{n.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Profile Avatar & Menu Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-3 rounded-full bg-dark-card border border-dark-border hover:border-brand/40 transition-all shadow-soft-sm"
                  aria-label="User account menu"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user?.name}</span>
                  <div className="w-7 h-7 rounded-full bg-brand text-dark-bg font-bold flex items-center justify-center text-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-dark-card border border-dark-border rounded-2xl shadow-soft-lg z-50 py-2 font-sans">
                      <div className="px-4 py-2 border-b border-dark-border">
                        <div className="text-xs font-bold text-slate-100">{user?.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                        <Badge variant={isAdmin ? 'admin' : 'bidder'} size="sm" className="mt-1.5">
                          {user?.role}
                        </Badge>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-zinc-800/60"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Profile & Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
