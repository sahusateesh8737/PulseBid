import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Shield, Sun, Moon, Bell, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, activeTenant } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [outbidEmail, setOutbidEmail] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">User Account & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Manage your personal profile, notification subscriptions, and active UI theme settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        <Card className="lg:col-span-8 p-6 sm:p-8 space-y-6 w-full">
          <div className="flex items-center gap-4 border-b border-dark-border pb-6">
            <div className="w-16 h-16 rounded-full bg-brand text-dark-bg font-extrabold text-2xl flex items-center justify-center shadow-soft-md shrink-0">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{name}</h2>
              <p className="text-xs text-slate-400 font-mono">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user?.role === 'ADMIN' ? 'admin' : 'bidder'}>{user?.role}</Badge>
                <Badge variant="tenant">{activeTenant?.name}</Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Display Name"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t border-dark-border space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand" /> Notification Subscriptions
              </h3>

              <label className="flex items-center justify-between p-4 bg-dark-surface rounded-2xl border border-dark-border cursor-pointer hover:border-brand/40 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-200">Instant Browser Outbid Alerts</span>
                  <p className="text-[11px] text-slate-400">Receive real-time WebSocket toast alerts when you are outbid</p>
                </div>
                <input
                  type="checkbox"
                  checked={outbidEmail}
                  onChange={(e) => setOutbidEmail(e.target.checked)}
                  className="w-4 h-4 accent-brand rounded"
                />
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {saved && <span className="text-xs text-emerald-400 font-mono font-bold">Preferences updated!</span>}
              <Button type="submit" variant="primary" icon={Save} className="ml-auto">
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>

        {/* Theme Settings Sidebar Panel */}
        <Card className="lg:col-span-4 p-6 space-y-4 w-full">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Appearance Mode</h3>
          <div className="p-4 bg-dark-surface rounded-2xl border border-dark-border space-y-4">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-brand" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Active: <span className="text-brand capitalize">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className="text-[11px] text-slate-400">Persisted in browser storage</div>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={toggleTheme} className="w-full">
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
