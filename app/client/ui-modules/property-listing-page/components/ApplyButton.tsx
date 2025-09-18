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
  hasApplied = false,
}: {
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
  userRole?: Role;
  hasApplied?: boolean;
}): React.JSX.Element {
  // Determine button text based on user role and application status
  let buttonText = "Apply";
  let isDisabled = isLoading || hasApplied;

  if (userRole === Role.AGENT) {
    buttonText = "Agents cannot apply";
    isDisabled = true;
  } else if (userRole === Role.LANDLORD) {
    buttonText = "Landlords cannot apply";
    isDisabled = true;
  } 
  else if (!userRole){
    buttonText = "Sign In to Apply";
    isDisabled = true;
  }
  else if (hasApplied) {
    buttonText = "Already Applied";
    isDisabled = true;
  } else if (isLoading) {
    buttonText = "Applying...";
  }

  return (
    <ThemedButton
      variant={ThemedButtonVariant.PRIMARY}
      onClick={isDisabled ? () => {} : onClick}
      className={twMerge(
        "w-[128px]",
        isDisabled || hasApplied ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      <span className="text-[14px]">
        {buttonText}
      </span>
    </ThemedButton>
  );
}
