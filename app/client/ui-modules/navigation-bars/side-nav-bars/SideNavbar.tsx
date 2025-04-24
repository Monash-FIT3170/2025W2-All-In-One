import React from "react";
import { Link } from "react-router";
import { SidebarContainer } from "./components/SidebarContainer";
import { SidebarHeader } from "./components/SidebarContainer";
import { SidebarContent } from "./components/SidebarContainer";

import { NavLinkItem } from "./components/NavBarLink";
import { NavBarLinks } from "./components/NavBarLink";

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
}

export function SideNavBar({ isOpen, onClose, navLinks }: SideNavBarProps) {
  const commonLinks = {
    profile: (
      <Link to="/profile" className="hover:underline">
        Profile
      </Link>
    ),
    settings: (
      <Link to="/settings" className="hover:underline">
        Settings
      </Link>
    ),
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader onClose={onClose} />
        <SidebarContent
          nav={<NavBarLinks links={navLinks} />}
          bottom={
            <>
              {commonLinks.profile}
              {commonLinks.settings}
            </>
          }
        />
      </SidebarContainer>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
          style={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
    </>
  );
}
