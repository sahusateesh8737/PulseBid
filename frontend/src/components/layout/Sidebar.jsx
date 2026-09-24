import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Gavel,
  Package,
  History,
  Trophy,
  User,
  ShieldAlert,
  Users,
  Settings,
  X,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { isAdmin, activeTenant } = useAuth();
  const location = useLocation();

  const bidderNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Auctions', path: '/auctions', icon: Gavel },
    { label: 'My Bids', path: '/my-bids', icon: History },
    { label: 'My Wins', path: '/my-wins', icon: Trophy },
  ];

  const sellerNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Auctions', path: '/auctions', icon: Gavel },
    { label: 'Inventory', path: '/inventory', icon: Package },
  ];

  const mainNav = isAdmin ? sellerNav : bidderNav;

  const adminNav = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: ShieldAlert },
    { label: 'Manage Auctions', path: '/admin/auctions', icon: Gavel },
    { label: 'Tenant Users', path: '/admin/users', icon: Users },
  ];

  const userNav = [
    { label: 'Profile & Theme', path: '/profile', icon: User },
    { label: 'Tenant Settings', path: '/settings', icon: Settings },
  ];

  const renderNavGroup = (title, items) => (
    <div className="space-y-1 py-2">
      {title && !isCollapsed && (
        <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          {title}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all font-medium ${
              isActive
                ? 'bg-brand text-dark-bg font-bold shadow-soft-sm shadow-brand/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon className={`w-4 h-4 ${isActive ? 'text-dark-bg' : 'text-slate-400'}`} />
            </div>
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-dark-surface border-r border-dark-border transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] z-30 shrink-0 ${
          isCollapsed ? 'w-20 px-2.5' : 'w-64 px-4'
        } py-4`}
      >
        {/* Tenant Label Header & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-border mb-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2 overflow-hidden">
              <div className="w-5 h-5 flex items-center justify-center text-brand shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-200 truncate">
                {activeTenant?.name || 'Tenant'}
              </span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar Collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-0.5">
          {renderNavGroup('MAIN STREAM', mainNav)}
          {isAdmin && renderNavGroup('ADMIN CONSOLE', adminNav)}
          {renderNavGroup('SETTINGS', userNav)}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-72 max-w-[80vw] h-full bg-dark-surface border-r border-dark-border p-5 flex flex-col justify-between z-10 shadow-soft-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-dark-border pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand" />
                    <span className="font-bold text-sm text-slate-100">{activeTenant?.name}</span>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[75vh]">
                  {renderNavGroup('MAIN STREAM', mainNav)}
                  {isAdmin && renderNavGroup('ADMIN CONSOLE', adminNav)}
                  {renderNavGroup('SETTINGS', userNav)}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
