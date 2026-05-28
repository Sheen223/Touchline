import React from 'react';

export const GlassCard = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-xl rounded-2xl 
        border border-white/10 
        ${hover ? 'hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};