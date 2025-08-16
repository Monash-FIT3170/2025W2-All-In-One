import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";

// Reject Button
export function RejectButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={onClick}
      className={twMerge("text-sm font-medium", className)}
    >
      Reject
    </ThemedButton>
  );
}

// Accept Button
export function AcceptButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={onClick}
      className={twMerge("text-sm font-medium", className)}
    >
      Accept
    </ThemedButton>
  );
}

// Background Pass Button
export function BackgroundPassButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={onClick}
      className={twMerge("text-sm font-medium", className)}
    >
      Background Pass
    </ThemedButton>
  );
}

// Background Fail Button
export function BackgroundFailButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={onClick}
      className={twMerge("text-sm font-medium", className)}
    >
      Background Fail
    </ThemedButton>
  );
}

// Send to Landlord Button
export function SendToLandlordButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.PRIMARY}
      onClick={onClick}
      className={twMerge("text-sm font-medium", className)}
    >
      Send to landlord
    </ThemedButton>
  );
}

// Done Button (for modal close)
export function DoneButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.SECONDARY}
      onClick={onClick}
      className={twMerge("font-medium", className)}
    >
      Done
    </ThemedButton>
  );
}