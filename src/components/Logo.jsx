import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="10" fill="url(#logo-gradient)" />
        <path
          d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8Z"
          stroke="#EAF2FF"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <path
          d="M16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11Z"
          fill="#EAF2FF"
          fillOpacity="0.2"
        />
        <circle cx="16" cy="16" r="2.5" fill="#EAF2FF" />
        <circle cx="16" cy="8" r="1.5" fill="#EAF2FF" />
        <circle cx="16" cy="24" r="1.5" fill="#EAF2FF" />
        <circle cx="8" cy="16" r="1.5" fill="#EAF2FF" />
        <circle cx="24" cy="16" r="1.5" fill="#EAF2FF" />
        <path
          d="M16 8V16M16 24V16M8 16H16M24 16H16"
          stroke="#EAF2FF"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
};

export default Logo;
