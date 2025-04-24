import React from "react";

interface PropManagerLogoTextProps {
  className?: string;
}

export function PropManagerLogoText({
  className,
}: PropManagerLogoTextProps): React.JSX.Element {
  return (
    <span className={`geist-semibold text-[18px] ${className} `}>
      PropManager
    </span>
  );
}