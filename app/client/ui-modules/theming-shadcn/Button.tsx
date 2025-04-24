import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const getVariantClasses = (variant: ButtonProps["variant"] = "default") => {
  switch (variant) {
    case "destructive":
      return "bg-red-600 text-white shadow-sm hover:bg-red-700";
    case "outline":
      return "border border-gray-300 bg-white text-black shadow-sm hover:bg-gray-100";
    case "secondary":
      return "bg-gray-100 text-black shadow-sm hover:bg-gray-200";
    case "ghost":
      return "bg-transparent hover:bg-gray-100 text-black";
    case "link":
      return "text-blue-600 underline-offset-4 hover:underline";
    case "default":
    default:
      return "bg-black text-white shadow hover:bg-gray-900";
  }
};

const getSizeClasses = (size: ButtonProps["size"] = "default") => {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-xs rounded-md";
    case "lg":
      return "h-10 px-8 text-base rounded-md";
    case "icon":
      return "h-9 w-9 p-0";
    case "default":
    default:
      return "h-9 px-4 py-2 text-sm rounded-md";
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 disabled:pointer-events-none";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);

    return (
      <button
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
