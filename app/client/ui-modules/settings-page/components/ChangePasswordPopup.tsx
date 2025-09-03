"use client"
import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Accounts } from "meteor/accounts-base";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import {
  changePassword,
  clearForm as clearChangePasswordForm,
  selectChangePasswordForm,
  setConfirmPassword,
  setCurrentPassword,
  setNewPassword,
} from "/app/client/ui-modules/settings-page/state/reducers/change-password-slice";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "/app/client/ui-modules/theming-shadcn/Dialog";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { Input } from "/app/client/ui-modules/theming-shadcn/Input";
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

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordPopup(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const changePasswordState = useAppSelector(selectChangePasswordForm);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: FormValues): Promise<void> {
    // Sync form values into Redux slice for unified auth flows
    dispatch(setCurrentPassword(values.currentPassword));
    dispatch(setNewPassword(values.newPassword));
    dispatch(setConfirmPassword(values.confirmPassword));

    try {
      // Close popup immediately on submit as requested
      setOpen(false);
      await dispatch(changePassword()).unwrap();
      Toast({
        title: "Password updated",
        content: "Your password has been changed successfully.",
      });
      form.reset();
      dispatch(clearChangePasswordForm());
    } catch (err: any) {
      Toast({
        title: "Password change failed",
        content: err || changePasswordState.error || "Unable to change password.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setCurrentPassword(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setNewPassword(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(setConfirmPassword(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={changePasswordState.isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={changePasswordState.isLoading}>
                {changePasswordState.isLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordPopup;


