"use client"
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "/app/client/ui-modules/theming-shadcn/Dialog";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { Textarea } from "/app/client/ui-modules/theming-shadcn/Textarea";
import { FeedbackPopup } from "/app/client/ui-modules/settings-page/components/FeedbackPopup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "/app/client/ui-modules/theming-shadcn/Form";

const schema = z.object({
  reason: z
    .string()
    .min(10, "Please provide at least 10 characters explaining your reason")
    .max(500, "Reason must be less than 500 characters"),
});

type FormValues = z.infer<typeof schema>;

export function DeactivateAccountPopup(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
    },
    mode: "onSubmit",
  });

  function handleSubmitClick() {
    // Show "Are you sure?" confirmation instead of submitting directly
    setShowAreYouSure(true);
  }

  async function confirmSubmission(): Promise<void> {
    setIsSubmitting(true);
    setShowAreYouSure(false);
    
    try {
      // Simulate API call - replace with actual deactivation logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close form popup and show confirmation popup
      setOpen(false);
      setShowConfirmation(true);
      
      // Reset form
      form.reset();
    } catch (err: any) {
      setFeedbackType("error");
      setFeedbackTitle("Submission Failed");
      setFeedbackMessage("Unable to submit your deactivation request. Please try again.");
      setFeedbackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Deactivate Account</Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitClick(); }} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  We're sorry to see you go. Please help us understand why you want to deactivate your account.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for deactivation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please tell us why you want to deactivate your account..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your feedback helps us improve our service. (10-500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Deactivation Request"}
              </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Are You Sure Warning Dialog */}
      <Dialog open={showAreYouSure} onOpenChange={setShowAreYouSure}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Are you sure you want to deactivate?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Warning: You may lose your account</p>
                <p className="text-sm text-muted-foreground">
                  This action will submit your account deactivation request. Once processed, you may lose access to your account and all associated data.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAreYouSure(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmSubmission}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Yes, Deactivate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Request Submitted</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Message Forwarded</p>
                <p className="text-sm text-muted-foreground">
                  Your deactivation request has been forwarded to our team and is being reviewed. 
                  You will receive an email confirmation shortly.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <FeedbackPopup
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        type={feedbackType}
        title={feedbackTitle}
        message={feedbackMessage}
      />
    </>
  );
}

export default DeactivateAccountPopup;
