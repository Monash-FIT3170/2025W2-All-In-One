import React from "react";
import {
  selectSettingsPageUiState,
} from "./state/reducers/settings-page-slice";
import { SettingsPageUiState as SettingsPageUiStateType } from "./state/SettingsPageUiState";
import { useSelector } from "react-redux";
import { SettingsSecurityPreferences } from "./components/SettingsSecurityPreferences";
import { SettingsAccountPreferences } from "./components/SettingsAccountPreferences";
import { SettingsAccountDeactivation } from "./components/SettingsAccountDeactivation";

export function SettingsPage(): React.JSX.Element {
  const SettingsPageUiState: SettingsPageUiStateType = useSelector(
    selectSettingsPageUiState
  );

  return (
    <SettingsPageBase
      SettingsPageUiState={SettingsPageUiState}
    />
  );
}

function SettingsPageBase({
  SettingsPageUiState,
}: {
  SettingsPageUiState: SettingsPageUiStateType;
}): React.JSX.Element {

  if (SettingsPageUiState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 border-blue-600 h-16 w-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <SettingsAccountPreferences />
      <SettingsSecurityPreferences />
      <SettingsAccountDeactivation/>
    </div>
  );
}
