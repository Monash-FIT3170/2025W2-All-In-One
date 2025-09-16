import React, { useState, useEffect } from "react";
import { Button } from "../theming-shadcn/Button";

interface SignButtonProps {
  documentId: string;
  isSigned: boolean; // comes from DB
  onSign?: (documentId: string) => void; // callback when user signs
}

export function SignButton({ documentId, isSigned, onSign }: SignButtonProps) {
  const [signed, setSigned] = useState(isSigned);

  // keep in sync if parent prop changes (e.g. after refetch)
  useEffect(() => {
    setSigned(isSigned);
  }, [isSigned]);

  const handleClick = () => {
    if (!signed) {
      setSigned(true); 
      onSign?.(documentId);
    }
  };

  return (
    <Button
      variant={signed ? "secondary" : "default"}
      size="sm"
      disabled={signed}
      onClick={handleClick}
      className={`h-8 px-3 ${!signed ? "cursor-pointer" : "cursor-default"}`}
    >
      {signed ? "Signed" : "Sign"}
    </Button>
  );
}
