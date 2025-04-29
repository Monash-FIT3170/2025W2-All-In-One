import React from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
interface TopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AgentTopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
  name?: string;
  title?: string;
}

export function AgentTopNavbar({
  onSideBarOpened,
  name = "Bob Builder",
  title = "Agent",
}: AgentTopNavbarProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: Menu icon and logo */}
        <div className="flex items-center gap-4">
          <SideBarSliderIcon
            onClick={() => onSideBarOpened(prev => !prev)}
            className="text-gray-600"
          />
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <PropManagerLogoText />
          </div>
        </div>

        {/* Right-aligned actions */}
        <div className="flex items-center gap-4">
          <div className="ml-2">
            <BellIcon
              hasNotifications={true}
              className="text-gray-600"
              onClick={() => console.log('Notification clicked')}
            />
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-400 cursor-pointer transition-colors duration-200"
              onClick={() => console.log('Profile clicked')}
            >
              {name.split(' ').map(part => part.charAt(0)).join('')}
            </div>
          </div>
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
