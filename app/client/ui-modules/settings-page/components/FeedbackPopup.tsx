import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "/app/client/ui-modules/theming-shadcn/Dialog";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}

export function FeedbackPopup({ isOpen, onClose, type, title, message }: FeedbackPopupProps) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : XCircle;
  const iconColor = isSuccess ? "text-green-500" : "text-red-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 shadow-xl backdrop-blur-none">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <DialogTitle className={isSuccess ? "text-green-700" : "text-red-700"}>
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={onClose}
            variant={isSuccess ? "default" : "destructive"}
            className="min-w-[80px]"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
