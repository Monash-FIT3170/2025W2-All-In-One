import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";
import { Role } from "/app/shared/user-role-identifier";

export function ApplyButton({
  onClick,
  className="",
  isLoading = false,
  userRole,
}: {
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
  userRole?: Role;
}): React.JSX.Element {
  // Determine button text based on user role
  let buttonText = "Apply";
  let isDisabled = isLoading;

  if (userRole === Role.AGENT) {
    buttonText = "Agents cannot apply";
    isDisabled = true;
  } else if (userRole === Role.LANDLORD) {
    buttonText = "Landlords cannot apply";
    isDisabled = true;
  } else if (isLoading) {
    buttonText = "Applying...";
  }

  return (
    <ThemedButton
      variant={ThemedButtonVariant.SECONDARY}
      onClick={isDisabled ? () => {} : onClick}
      className={twMerge("w-[128px]", className)}
    >
      <span className="text-[14px]">
        {buttonText}
      </span>
    </ThemedButton>
  );
}
