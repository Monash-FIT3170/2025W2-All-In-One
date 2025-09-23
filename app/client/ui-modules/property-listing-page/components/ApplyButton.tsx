import React from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";
import { Role } from "/app/shared/user-role-identifier";
import { NavigationPath } from "/app/client/navigation";

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
  const navigate = useNavigate();
  const location = useLocation();

  // Determine button text based on user role and application status
  let buttonText = "Apply";
  let isDisabled = isLoading || hasApplied;
  let buttonOnClick = onClick;

  if (userRole === Role.AGENT) {
    buttonText = "Agents cannot apply";
    isDisabled = true;
  } else if (userRole === Role.LANDLORD) {
    buttonText = "Landlords cannot apply";
    isDisabled = true;
  }
  else if (!userRole){
    buttonText = "Sign In to Apply";
    isDisabled = false;
    buttonOnClick = () => navigate(NavigationPath.Signin, { state: { from: location.pathname + location.search } });
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
      onClick={isDisabled ? () => {} : buttonOnClick}
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
