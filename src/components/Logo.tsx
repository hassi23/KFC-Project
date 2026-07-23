import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="KFC logo"
    >
      <circle cx="50" cy="50" r="48" fill="#B91C1C" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.35" />

      {/* Drumstick accent */}
      <g transform="translate(50 30) rotate(-18)" opacity="0.9">
        <ellipse cx="0" cy="-6" rx="7" ry="9" fill="#FDE68A" />
        <path d="M -2 2 Q -1 12 -4 18 Q -2 21 1 19 Q 3 12 2 2 Z" fill="#FDE68A" />
      </g>

      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="30"
        fill="#ffffff"
        letterSpacing="1"
      >
        KFC
      </text>

      <path
        id="ribbon"
        d="M 18 78 A 32 32 0 0 0 82 78"
        fill="none"
      />
      <text fontFamily="Arial, sans-serif" fontWeight="800" fontSize="8.5" fill="#FBBF24" letterSpacing="1.5">
        <textPath href="#ribbon" startOffset="50%" textAnchor="middle">
          FRIED CHICKEN
        </textPath>
      </text>
    </svg>
  );
}
