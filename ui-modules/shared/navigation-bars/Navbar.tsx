import React from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../icons/PropManagerLogoIcon";
import PrimaryButton from "../../theming/PrimaryButton";

interface TopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
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
          <PropManagerLogoIcon variant="dark" />
          <span className="geist-h1">PropManager</span>
        </div>

        {/* Right-aligned buttons */}
        <div className="flex gap-6 ml-auto">
          <Link to="/login">
            <PrimaryButton variant="black">Login</PrimaryButton>
          </Link>
          <Link to="/signup">
            <PrimaryButton variant="white">Sign Up!</PrimaryButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
