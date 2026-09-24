import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 transition-all ${
        hoverEffect ? 'hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-zinc-800/80 pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-100 tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-zinc-800/80 pt-4 mt-4 ${className}`}>{children}</div>
);
