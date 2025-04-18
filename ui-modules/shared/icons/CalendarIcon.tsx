import React from "react";

export function CalendarIcon({
  className = "h-6 w-6",
  variant = "dark", // Light works when overlayed on a white background, dark works when overlayed on a black background
}: {
  className?: string;
  variant?: "dark" | "light";
}): React.JSX.Element {
  const iconColor = variant === "dark" ? "#FFFFFF" : "#000000";

  return (
    <svg
      className={className}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          .cls-1{" "}
          {"fill:none;stroke:" +
            iconColor +
            ";stroke-miterlimit:10;stroke-width:1.91px;"}
        </style>
      </defs>
      <rect className="cls-1" x="1.48" y="3.37" width="21.04" height="4.78" />
      <rect className="cls-1" x="1.48" y="8.15" width="21.04" height="14.35" />
      <line className="cls-1" x1="12" y1="0.5" x2="12" y2="5.28" />
      <line className="cls-1" x1="6.26" y1="0.5" x2="6.26" y2="5.28" />
      <line className="cls-1" x1="17.74" y1="0.5" x2="17.74" y2="5.28" />
      <polyline
        className="cls-1"
        points="6.26 12.94 10.09 12.94 10.09 15.8 7.22 15.8 7.22 18.67 11.04 18.67"
      />
      <rect className="cls-1" x="13.91" y="12.93" width="3.83" height="2.87" />
      <rect className="cls-1" x="13.91" y="15.8" width="3.83" height="2.87" />
    </svg>
  );
}
