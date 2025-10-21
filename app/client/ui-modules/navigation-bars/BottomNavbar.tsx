import React from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { NavBarLink } from "./side-nav-bars/components/NavBarLink";

export function BottomNavbar(): React.JSX.Element {
  return (
    <footer className="bg-[#111827] text-white py-4 mt-auto">
      <div className="flex justify-between items-center px-6">
        <Link to="/">
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <PropManagerLogoText className="white-text" />
          </div>
        </Link>

        <div className="flex gap-6 ml-auto">
          <NavBarLink to="/about">About</NavBarLink>
          <NavBarLink to="/contact">Contact</NavBarLink>
          <NavBarLink to="/privacy-policy">Privacy Policy</NavBarLink>
          <NavBarLink to="/terms">Terms</NavBarLink>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="geist-body">© 2025 PropManager. All rights reserved.</p>
      </div>
    </footer>
  );
}
