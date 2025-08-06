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
      variant="ghost"
      className={`w-full py-3 border-transparent rounded-lg text-center hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}