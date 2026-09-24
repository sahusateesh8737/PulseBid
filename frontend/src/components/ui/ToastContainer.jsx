import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Zap, X } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isOutbid = toast.type === 'outbid';
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto rounded-2xl p-4 shadow-soft-lg border flex items-start gap-3 backdrop-blur-md ${
                isOutbid
                  ? 'bg-dark-surface/95 border-brand text-slate-100 shadow-yellow-glow'
                  : isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                  : isError
                  ? 'bg-red-950/90 border-red-500/40 text-red-100'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                  : 'bg-dark-surface/95 border-dark-border text-slate-100'
              }`}
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {isOutbid && <Zap className="w-5 h-5 text-brand animate-pulse" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isOutbid && !isSuccess && !isError && !isWarning && (
                  <Info className="w-5 h-5 text-blue-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-slate-300/90 mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}

                {/* Quick Action */}
                {toast.action && (
                  <button
                    onClick={() => {
                      if (toast.action.auctionId) {
                        navigate(`/auctions/${toast.action.auctionId}`);
                      }
                      onDismiss(toast.id);
                    }}
                    className="mt-2 text-xs font-bold font-mono px-3 py-1 rounded-full bg-brand text-dark-bg hover:bg-brand-hover transition-all"
                  >
                    {toast.action.label} →
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
