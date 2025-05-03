import React from 'react';

interface BellIconProps {
  className?: string;
  hasNotifications?: boolean;
  onClick?: () => void;
}

export function BellIcon({ className = '', hasNotifications = false, onClick }: BellIconProps): React.JSX.Element {
  return (
    <div
      className={`relative inline-block ${className} hover:text-gray-400 cursor-pointer transition-colors duration-200`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-bell"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasNotifications && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}
