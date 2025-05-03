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
      <div className="p-5">
        <TopNavbar onSideBarOpened={onSideBarOpened} />

        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          navLinks={agentLinks}
        ></SideNavBar>
        </div>
    );
  }
}