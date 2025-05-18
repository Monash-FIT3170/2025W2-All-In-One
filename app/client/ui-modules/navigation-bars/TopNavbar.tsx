import React from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
import { useAppSelector } from "/app/client/store";
import { ProfileFooter } from "../navigation-bars/side-nav-bars/components/ProfileFooter";

interface TopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AgentTopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
  name?: string;
  title?: string;
}

interface LandlordTopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
  name?: string;
  title?: string;
}

export function AgentTopNavbar({
  onSideBarOpened,
  // name = "Bob Builder",
  // title = "Agent",
}: AgentTopNavbarProps): React.JSX.Element {
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const firstName = currentUser?.firstName || "Unknown";
  const lastName = currentUser?.lastName || "User";
  const title = "Agent";
  console.log("Current User:", currentUser);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: Menu icon and logo */}
        <div className="flex items-center gap-4">
          <SideBarSliderIcon
            onClick={() => onSideBarOpened((prev) => !prev)}
            className="text-gray-600"
          />
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <PropManagerLogoText />
          </div>
        </div>

        {/* Right-aligned profile section */}
        <div className="flex items-center gap-4">
          <div className="ml-2">
            <BellIcon
              hasNotifications={true}
              className="text-gray-600"
              onClick={() => console.log("Notification clicked")}
            />
          </div>
          <ProfileFooter firstName={firstName} lastName={lastName} title={title} />
        </div>
      </div>
    </header>
  );
}

export function LandlordTopNavbar({
  onSideBarOpened,
}: LandlordTopNavbarProps): React.JSX.Element {
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const firstName = currentUser?.firstName || "Unknown";
  const lastName = currentUser?.lastName || "User";
  const title = "Landlord";
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: Menu icon and logo */}
        <div className="flex items-center gap-4">
          <SideBarSliderIcon
            onClick={() => onSideBarOpened((prev) => !prev)}
            className="text-gray-600"
          />
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <PropManagerLogoText />
          </div>
        </div>

        {/* Right-aligned profile section */}
        <div className="flex items-center gap-4">
          <div className="ml-2">
            <BellIcon
              hasNotifications={true}
              className="text-gray-600"
              onClick={() => console.log("Notification clicked")}
            />
          </div>
          <ProfileFooter firstName={firstName} lastName={lastName} title={title} />
        </div>
      </div>
    </header>
  );
}

export function TenantTopNavbar({
  onSideBarOpened,
}: AgentTopNavbarProps): React.JSX.Element {
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const firstName = currentUser?.firstName || "Unknown";
  const lastName = currentUser?.lastName || "User";
  const title = "Tenant";
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: Menu icon and logo */}
        <div className="flex items-center gap-4">
          <SideBarSliderIcon
            onClick={() => onSideBarOpened((prev) => !prev)}
            className="text-gray-600"
          />
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <PropManagerLogoText />
          </div>
        </div>

        {/* Right-aligned profile section */}
        <div className="flex items-center gap-4">
          <div className="ml-2">
            <BellIcon
              hasNotifications={true}
              className="text-gray-600"
              onClick={() => console.log("Notification clicked")}
            />
          </div>
          <ProfileFooter firstName={firstName} lastName={lastName} title={title} />
        </div>
      </div>
    </header>
  );
}

export function TopNavbar({
  onSideBarOpened,
}: TopNavbarProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 bg-white text-black py-4 shadow">
      <div className="flex justify-between items-center px-6">
        {/* Left-aligned logo */}
        <div
          onClick={() => onSideBarOpened(true)} // Open the sidebar when the logo is clicked
          className="flex items-center gap-2 cursor-pointer"
        >
          <PropManagerLogoIcon variant="light" />
          <PropManagerLogoText />
        </div>

        {/* Right-aligned buttons */}
        <div className="flex gap-6 ml-auto">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
