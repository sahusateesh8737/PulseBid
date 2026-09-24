import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || props.name || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full bg-dark-surface border text-slate-100 text-sm rounded-xl px-4 py-3 transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/40 ${
            Icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
              : 'border-dark-border focus:border-brand hover:border-zinc-700'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-medium tracking-tight mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
