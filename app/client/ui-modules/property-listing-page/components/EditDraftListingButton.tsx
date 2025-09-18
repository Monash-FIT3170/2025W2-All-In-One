import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";

export function EditDraftListingButton({
  onClick,
  className="",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.PRIMARY}
      onClick={onClick}
      className={twMerge("w-[128px]", className)}
    >
      <span className="text-[14px]">Edit Listing</span>
    </ThemedButton>
  );
}
