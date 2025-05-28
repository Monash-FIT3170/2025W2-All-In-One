import React from "react";
import { useNavigate } from "react-router";
import {
  SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "./components/SidebarContainer";
import { NavBarLinks, NavLinkItem } from "./components/NavBarLink";
import { NavGroup } from "./components/NavGroup";
import { ProfileFooter } from "./components/ProfileFooter";
import { useAppSelector } from "/app/client/store";
import { Role } from "/app/shared/user-role-identifier";
import {
  agentDashboardLinks,
  landlordDashboardLinks,
  tenantDashboardLinks,
  settingLinks,
} from "./side-nav-link-definitions";

interface RoleSideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSideNavBar({ isOpen, onClose }: RoleSideNavBarProps) {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const profileData = useAppSelector((state) => state.currentUser.profileData);

  const firstName = profileData?.firstName || "Unknown";
  const lastName = profileData?.lastName || "User";
  const title = authUser?.role || "User";

  let dashboardLinks: NavLinkItem[] = [];
  if (authUser?.role === Role.AGENT) {
    dashboardLinks = agentDashboardLinks;
  } else if (authUser?.role === Role.LANDLORD) {
    dashboardLinks = landlordDashboardLinks;
  } else if (authUser?.role === Role.TENANT) {
    dashboardLinks = tenantDashboardLinks;
  }

  const handleProfileClick = () => {
    navigate("/profile");
    onClose();
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader onClose={onClose} />
        <SidebarContent
          nav={
            <>
              <NavGroup title="Dashboard">
                <NavBarLinks links={dashboardLinks} onClose={onClose} />
              </NavGroup>
              <NavGroup title="Settings">
                <NavBarLinks links={settingLinks} onClose={onClose} />
              </NavGroup>
            </>
          }
        />
        <SidebarFooter>
          <div className="cursor-pointer" onClick={handleProfileClick}>
            <ProfileFooter
              firstName={firstName}
              lastName={lastName}
              title={title}
            />
          </div>
        </SidebarFooter>
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
