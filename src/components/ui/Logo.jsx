import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ className = "w-full h-auto", animated = false }) => {
  // Custom animation variants
  const swooshVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const ballVariants = {
    hidden: { x: -50, rotate: -180, opacity: 0 },
    visible: { 
      x: 0, 
      rotate: 0, 
      opacity: 1,
      transition: { duration: 1, ease: "backOut", delay: 0.3 }
    }
  };

  return (
    <div className={className}>
      <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="fieldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Background Arch / Pitch */}
        <path d="M 120 150 A 130 130 0 0 1 380 150" stroke="url(#greenGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M 140 150 A 110 110 0 0 1 360 150" fill="url(#fieldGradient)" />
        
        {/* Pitch lines */}
        <line x1="250" y1="40" x2="250" y2="150" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <circle cx="250" cy="95" r="30" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
        <line x1="150" y1="150" x2="350" y2="150" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        
        {/* The Bold 'T' */}
        <path d="M 160 50 L 340 50 L 330 90 L 275 90 L 260 180 L 220 180 L 235 90 L 170 90 Z" fill="#111827" />

        {/* The Swooshes */}
        <motion.path 
          d="M 50 180 Q 200 180, 350 130" 
          stroke="url(#greenGradient)" 
          strokeWidth="14" 
          strokeLinecap="round"
          fill="none"
          initial={animated ? "hidden" : "visible"}
          animate="visible"
          variants={swooshVariants}
        />
        <motion.path 
          d="M 70 198 Q 220 198, 360 148" 
          stroke="#111827" 
          strokeWidth="8" 
          strokeLinecap="round"
          fill="none"
          initial={animated ? "hidden" : "visible"}
          animate="visible"
          variants={swooshVariants}
          transition={{ delay: 0.2 }}
        />

        {/* Soccer Ball */}
        <motion.g 
          transform="translate(370, 135)"
          initial={animated ? "hidden" : "visible"}
          animate="visible"
          variants={ballVariants}
          style={{ transformOrigin: "370px 135px" }}
        >
          <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#111827" strokeWidth="4" />
          {/* Hexagons / Pentagons pattern */}
          <path d="M 0 -16 L 15 -5 L 10 13 L -10 13 L -15 -5 Z" fill="#111827" />
          <path d="M 0 -16 L 0 -32 M 15 -5 L 30 -10 M 10 13 L 20 25 M -10 13 L -20 25 M -15 -5 L -30 -10" stroke="#111827" strokeWidth="3" />
        </motion.g>

        {/* TOUCHLINE Text */}
        <text 
          x="250" 
          y="255" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="64" 
          fontWeight="900" 
          fontStyle="italic"
          letterSpacing="-1"
          fill="#111827"
        >
          TOUCHLINE
        </text>
        
        {/* Subtle text underline swoosh */}
        <motion.path 
          d="M 110 270 Q 250 255, 420 260" 
          stroke="url(#greenGradient)" 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
          initial={animated ? "hidden" : "visible"}
          animate="visible"
          variants={swooshVariants}
          transition={{ delay: 0.4 }}
        />
      </svg>
    </div>
  );
};
