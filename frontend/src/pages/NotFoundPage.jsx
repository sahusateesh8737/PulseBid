import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-300 mb-4">
        <AlertTriangle className="w-6 h-6 text-amber-400" />
      </div>
      <h1 className="text-3xl font-bold font-mono text-slate-100">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
        The requested auction room or page could not be located in this tenant namespace.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Return to Auction Discovery
        </Button>
      </Link>
    </div>
  );
};
