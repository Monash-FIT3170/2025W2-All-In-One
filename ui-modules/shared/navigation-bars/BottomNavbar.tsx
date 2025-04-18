import React from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../icons/PropManagerLogoIcon";
import { NavBarLink } from "./NavBarLink";

export function BottomNavbar(): React.JSX.Element {
  return (
    <footer className="bg-[#111827] text-white py-4 mt-8">
      <div className="flex justify-between items-center px-6">
        {/* Left-aligned logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <PropManagerLogoIcon variant="light" />
            <span className="geist-h1">Prop Manager</span>{" "}
            {/* Applying Geist Header 1 */}
          </div>
        </Link>

        {/* Right-aligned links */}
        <div className="flex gap-6 ml-auto">
          <NavBarLink to="/about">About</NavBarLink>
          <NavBarLink to="/contact">Contact</NavBarLink>
          <NavBarLink to="/privacy-policy">Privacy Policy</NavBarLink>
          <NavBarLink to="/terms">Terms</NavBarLink>
        </div>
      </div>

      {/* Centered copyright text */}
      <div className="text-center mt-4">
        <p className="geist-body">© 2025 PropManager. All rights reserved.</p>
      </div>
    </footer>
  );
}
