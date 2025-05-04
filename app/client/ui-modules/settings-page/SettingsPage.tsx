import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { SideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import { TopNavbar } from "../navigation-bars/TopNavbar";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { selectSettingsPageUiState } from "./state/reducers/settings-page-slice";
import { SettingsPageUiState } from "./state/SettingsPageUiState";
import { Checkbox } from "./components/FormCheckbox";


export function SettingsPage(): React.JSX.Element {
  const SettingsPageUiState: SettingsPageUiState = useSelector(
    selectSettingsPageUiState
  );

  return (
    <SettingsPageBase SettingsPageUiState={SettingsPageUiState} />
  );
}

function SettingsPageBase({
  SettingsPageUiState,
}: {
  SettingsPageUiState: SettingsPageUiState;
}): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

  if (SettingsPageUiState.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="p-5 space-y-6">
        <TopNavbar onSideBarOpened={onSideBarOpened} />

        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          navLinks={agentLinks}
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" />
          <label htmlFor="notifications" className="text-sm">
            Enable notifications
          </label>
        </div>
      </div>
    );
  }
}
