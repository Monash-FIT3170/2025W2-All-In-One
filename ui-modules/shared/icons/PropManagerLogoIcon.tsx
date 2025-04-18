import React from "react";

export function PropManagerLogoIcon({
  className = "h-6 w-6",
  variant = "dark", // 'dark' or 'light' --> A dark variant has a black background with white lines, a light variant has a white background with black lines
}: {
  className?: string;
  variant?: "dark" | "light";
}): React.JSX.Element {
  const isDark = variant === "dark";

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        width="32"
        height="32"
        rx="6"
        fill={isDark ? "var(--black)" : "white"}
      />
      <path
        d="M8.5 13.5L16 7.66669L23.5 13.5V22.6667C23.5 23.1087 23.3244 23.5326 23.0118 23.8452C22.6993 24.1578 22.2754 24.3334 21.8333 24.3334H10.1667C9.72464 24.3334 9.30072 24.1578 8.98816 23.8452C8.67559 23.5326 8.5 23.1087 8.5 22.6667V13.5Z"
        stroke={isDark ? "white" : "black"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 24.3333V16H18.5V24.3333"
        stroke={isDark ? "white" : "black"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
