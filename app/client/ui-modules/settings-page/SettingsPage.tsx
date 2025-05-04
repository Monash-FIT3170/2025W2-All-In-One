import React from "react";
import { Link } from "react-router";
import { SideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import { TopNavbar } from "../navigation-bars/TopNavbar";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
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
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

  if (SettingsPageUiState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 space-y-6">
      <TopNavbar onSideBarOpened={onSideBarOpened} />

      <SideNavBar
        isOpen={isSidebarOpen}
        onClose={() => onSideBarOpened(false)}
        navLinks={agentLinks}
      />
      <SettingsAccountPreferences />
      <SettingsNotificationPreferences />
      <SettingsSecurityPreferences />
    </div>
  );
}
