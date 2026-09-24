import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Access Denied</h2>
        <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
          Tenant administrator privileges are required to access this resource. Your current account role is <span className="font-mono text-slate-200 uppercase font-semibold">BIDDER</span>.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return Back
        </Button>
      </div>
    );
  }

  return children;
};
