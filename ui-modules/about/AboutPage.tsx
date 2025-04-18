import React from "react";
import type { AppDispatch } from "/app/store";
import { useDispatch, useSelector } from "react-redux";
import { AboutPageUiState } from "./state/AboutPageUiState";
import { selectAboutPageUiState } from "./state/reducers/about-page-slice";
import { UserDropdown } from "/ui-modules/shared/UserDropdown";
import { SideNavBar } from "../../ui-modules/shared/navigation-bars/SideNavbar";
import { TopNavbar } from "../../ui-modules/shared/navigation-bars/Navbar";

export function AboutPage(): React.JSX.Element {
  const aboutPageUiState: AboutPageUiState = useSelector(
    selectAboutPageUiState
  );

  return (
    <AboutPageBase aboutPageUiState={aboutPageUiState} />
    // Other components can go here if needed
  );
}

function AboutPageBase({
  aboutPageUiState,
}: {
  aboutPageUiState: AboutPageUiState;
}): React.JSX.Element {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  if (aboutPageUiState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      {/* Top Navigation */}
      <TopNavbar setSidebarOpen={setSidebarOpen} />

      {/* Sidebar Navigation */}
      <SideNavBar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <h1 className="title-example-style">About Prop Manager</h1>

      <section className="app-description">
        <p>
          Prop Manager is an all-in-one application for renters, agents, and
          landlords. This first-class tool reduces the manual work needed
          throughout the rental process — from first listing to ongoing tenancy.
          Here's how each type of user benefits:
        </p>

        <UserDropdown title="Landlords">
          <p>
            Manage multiple properties, track rent payments, and communicate
            directly with agents. Sign and review lease agreements and choose
            your preferred tenant.
          </p>
        </UserDropdown>

        <UserDropdown title="Tenants">
          <p>
            Find rental properties, apply, submit maintenance requests, and
            communicate with your agent. Receive reminders for rent payments and
            lease expirations.
          </p>
        </UserDropdown>

        <UserDropdown title="Agents" >
          <p>
            List new properties, review applicants, and communicate with both
            tenants and landlords. Manage requests and schedule inspections
            efficiently.
          </p>
        </UserDropdown>
      </section>
    </div>
  );
}
