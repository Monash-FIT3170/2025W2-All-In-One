import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router";
import { NavigationPath } from "/app/client/navigation";

export function ContactAgentButton({
  propertyId,
  className="",
}: {
  propertyId: string;
  className?: string;
}): React.JSX.Element {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(NavigationPath.TenantMessages, {
      state: { propertyId }
    });
  };
  return (
    <ThemedButton
      variant={ThemedButtonVariant.SECONDARY}
      onClick={handleClick}
      className={twMerge("w-[128px]", className)}
    >
      <span className="text-[14px]">Contact Agent</span>
    </ThemedButton>
  );
}
