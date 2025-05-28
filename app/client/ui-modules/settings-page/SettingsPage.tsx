import React from "react";
import { Link } from "react-router";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import {
  selectSettingsPageUiState,
  setTextNotificationsEnabled,
} from "./state/reducers/settings-page-slice";
import { SettingsPageUiState as SettingsPageUiStateType } from "./state/SettingsPageUiState";
import { Checkbox } from "./components/FormCheckbox";
import { SettingsNotificationPreferences } from "./components/SettingsNotificationPreferences";
import { useDispatch, useSelector } from "react-redux";
import { SettingsSecurityPreferences } from "./components/SettingsSecurityPreferences";
import { SettingsAccountPreferences } from "./components/SettingsAccountPreferences";
import { SettingsAccountDeactivation } from "./components/SettingsAccountDeactivation";

export function SettingsPage(): React.JSX.Element {
  const dispatch = useDispatch();
  const SettingsPageUiState: SettingsPageUiStateType = useSelector(
    selectSettingsPageUiState
  );

  const handleToggleChange = (checked: boolean) => {
    dispatch(setTextNotificationsEnabled(checked));
  };

  return (
    <SettingsPageBase
      SettingsPageUiState={SettingsPageUiState}
      onToggleChange={handleToggleChange}
    />
  );
}

function SettingsPageBase({
  SettingsPageUiState,
  onToggleChange,
}: {
  SettingsPageUiState: SettingsPageUiStateType;
  onToggleChange: (checked: boolean) => void;
}): React.JSX.Element {

  if (SettingsPageUiState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 space-y-6">
      <SettingsAccountPreferences />
      <SettingsNotificationPreferences />
      <SettingsSecurityPreferences />
      <SettingsAccountDeactivation/>
    </div>
  );
}
