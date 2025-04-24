import React from 'react';

interface SidebarSliderIconProps {
  className?: string;
  onClick?: () => void;
}

export function SidebarSliderIcon({ className = '', onClick }: SidebarSliderIconProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`p-1 hover:bg-gray-100 rounded-md ${className}`}
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
        className="feather feather-SidebarSlider"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
