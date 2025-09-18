"use client";
import * as React from "react";
import { DeactivateAccountPopup } from "./DeactivateAccountPopup";

export function SettingsAccountDeactivation() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border border-red-500 bg-red-50 p-3 shadow-sm">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Deactivate Account</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily disable your account. You can reactivate it at
                any time.
              </p>
            </div>
            <DeactivateAccountPopup />
          </div>
        </div>
      </div>
    </div>
  );
}