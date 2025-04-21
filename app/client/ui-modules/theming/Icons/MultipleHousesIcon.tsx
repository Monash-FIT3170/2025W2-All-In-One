import React from "react";

export function MultipleHousesIcon({
  className = "h-6 w-6",
  variant = "dark", // Light works when overlayed on a white background, dark works when overlayed on a black background
}: {
  className?: string;
  variant?: "dark" | "light";
}): React.JSX.Element {
  const iconColor = variant === "dark" ? "#FFFFFF" : "#000000";

  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <style>
          {`
            .cls-1 {
              fill: none;
              stroke: ${iconColor};
              stroke-miterlimit: 10;
              stroke-width: 1.91px;
            }
          `}
        </style>
      </defs>
      <polygon
        className="cls-1"
        points="12.96 11.04 12.96 18.68 1.5 18.68 1.5 11.04 7.23 5.32 12.96 11.04"
      />
      <polygon
        className="cls-1"
        points="17.73 11.04 17.73 18.68 12.96 18.68 12.96 11.04 9.61 7.71 12 5.32 17.73 11.04"
      />
      <polygon
        className="cls-1"
        points="22.5 11.04 22.5 18.68 17.73 18.68 17.73 11.04 14.39 7.71 16.77 5.32 22.5 11.04"
      />
      <rect className="cls-1" x="5.32" y="13.91" width="3.82" height="4.77" />
    </svg>
  );
}
