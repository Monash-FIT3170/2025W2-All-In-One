import React from "react";
import { twMerge } from "tailwind-merge";

export enum ThemedButtonVariant {
  PRIMARY,
  SECONDARY,
  TERTIARY,
  QUATERNARY,
  DANGER,
}

/**
 * Basic button themed according to PropManager figma designs.
 * @param variant `PRIMARY` = black, `SECONDARY` = white, `TERTIARY` = blue
 */
export function ThemedButton({
  variant,
  onClick,
  children,
  className = "",
}: {
  variant: ThemedButtonVariant;
  onClick: () => void;
  children: React.ReactNode
  className?: string;
}): React.JSX.Element {
  const variantStyling: { [key in ThemedButtonVariant]: string } = {
    [ThemedButtonVariant.PRIMARY]: "bg-(--button-black-color) text-white",
    [ThemedButtonVariant.SECONDARY]: "border border-(--divider-color)",
    [ThemedButtonVariant.TERTIARY]: "bg-(--button-blue-color) text-white",
    [ThemedButtonVariant.QUATERNARY]: "bg-[#1E40AF] text-white",
    [ThemedButtonVariant.DANGER]: "bg-red-700 text-white",
  };  

  return (
    <button
      onClick={onClick}
      className={twMerge(
        `${variantStyling[variant]} px-3 py-1.5 rounded-md cursor-pointer`,
        className
      )}
    >
      {children}
    </button>
  );
}
