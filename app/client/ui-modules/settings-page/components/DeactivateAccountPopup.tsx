"use client"
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "/app/client/ui-modules/theming-shadcn/Dialog";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { Textarea } from "/app/client/ui-modules/theming-shadcn/Textarea";
import { Toast } from "/app/client/ui-modules/settings-page/components/Toast";
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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: FormValues): Promise<void> {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual deactivation logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close form popup and show confirmation popup
      setOpen(false);
      setShowConfirmation(true);
      
      // Reset form
      form.reset();
    } catch (err: any) {
      Toast({
        title: "Submission Failed",
        content: "Unable to submit your deactivation request. Please try again.",
      });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
    </>
  );
}

export default DeactivateAccountPopup;
