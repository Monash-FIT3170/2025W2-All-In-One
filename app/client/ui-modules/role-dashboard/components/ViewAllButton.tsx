import React from "react";
import { Button } from "../../theming-shadcn/Button";

interface ViewAllButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ViewAllButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: ViewAllButtonProps): React.JSX.Element {
  return (
    <Button
      variant="default"
      className={`w-full py-3 border-transparent rounded-lg text-center bg-slate-800 hover:bg-gray-500 transition-colors duration-200 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}