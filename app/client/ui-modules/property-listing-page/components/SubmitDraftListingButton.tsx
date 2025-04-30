import React from "react";
import { twMerge } from "tailwind-merge";
import { RoundedButton } from "/app/client/ui-modules/common/RoundedButton";

export function SubmitDraftListingButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <RoundedButton
      onClick={onClick}
      className={twMerge("bg-(--status-orange-color) px-7 py-2", className)}
    >
      <span className="geist-semibold text-[20px] text-white">
        SUBMIT DRAFT
      </span>
    </RoundedButton>
  );
}
