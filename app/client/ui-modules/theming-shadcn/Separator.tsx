"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { twMerge } from "tailwind-merge";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const baseClasses = "shrink-0 bg-border";
    const orientationClasses =
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]";

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={twMerge(baseClasses, orientationClasses, className)}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
