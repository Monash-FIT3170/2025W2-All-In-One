import React from "react";
import { GuestLandingPageUiState } from "./state/GuestLandingPageUiState";
import { Link } from "react-router";
import Ripple from "./animations/Ripple";
import { selectGuestLandingPageUiState } from "./state/reducers/guest-landing-page-slice";
import { useSelector } from "react-redux";
import { SideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import { Button } from "../theming-shadcn/Button";
import { Input } from "../theming-shadcn/Input";
import { agentLinks } from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
export function GuestLandingPage(): React.JSX.Element {
  const GuestLandingPageUiState: GuestLandingPageUiState = useSelector(
    selectGuestLandingPageUiState
  );

  return (
    <GuestLandingPageBase GuestLandingPageUiState={GuestLandingPageUiState} />
  );
}

function GuestLandingPageBase({
  GuestLandingPageUiState,
}: {
  GuestLandingPageUiState: GuestLandingPageUiState;
}): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  if (GuestLandingPageUiState.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="p-5">

        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          navLinks={agentLinks}
        ></SideNavBar>

        <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
          {/* Animated Ripple Background */}
          <Ripple />
          {/* Foreground content */}
          <div className="relative z-10 text-center">
            <h1 className={`geist-extrabold text-[70px]  `}>
              Find your perfect rental home
            </h1>
            <p className={`geist-light text-[18px] `}>
              Search thousands of rental properties in your area
            </p>
            {/* Search input and button */}
            <div className="flex justify-center gap-4">
              <Input type="Search" placeholder="Enter a postcode or suburb" />
              <Link to="/signin">
                <Button>Search</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
