import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
import { useAppSelector, useAppDispatch } from "/app/client/store";
import { ProfileFooter } from "../navigation-bars/side-nav-bars/components/ProfileFooter";
import { signoutUser } from "../user-authentication/state/reducers/current-user-slice";
import { NotificationBellDropdown } from "../theming/components/NotificationBellDropdown";
import { selectTasks as selectAgentTasks } from "../role-dashboard/agent-dashboard/state/agent-dashboard-slice";
import { selectTasks as selectTenantTasks } from "../role-dashboard/tenant-dashboard/state/reducers/tenant-dashboard-slice";
import { selectTasks as selectLandlordTasks } from "../role-dashboard/landlord-dashboard/state/landlord-dashboard-slice";
import { selectAllConversations } from "../role-messages/state/reducers/messages-slice";
import { Role } from "/app/shared/user-role-identifier";
import { NavigationPath } from "../../navigation";

interface TopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TopNavbar({
  onSideBarOpened,
}: TopNavbarProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const profileData = useAppSelector((state) => state.currentUser.profileData);
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const agentTasks = useAppSelector(selectAgentTasks);
  const tenantTasks = useAppSelector(selectTenantTasks);
  const landlordTasks = useAppSelector(selectLandlordTasks);
  const conversations = useAppSelector(selectAllConversations);

  const upcomingTasks = authUser?.role === Role.AGENT ? agentTasks : authUser?.role === Role.TENANT ? tenantTasks : authUser?.role === Role.LANDLORD ? landlordTasks : [];

  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSignout = async () => {
    try {
      await dispatch(signoutUser()).unwrap();
      navigate(NavigationPath.Home);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleGoHome = () => navigate(NavigationPath.Home);
  const handleGoProfile = () => navigate(NavigationPath.Profile);

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: sidebar (only if logged in) + logo */}
        <div className="flex items-center gap-4">
          {currentUser && (
            <SideBarSliderIcon
              onClick={() => onSideBarOpened((prev) => !prev)}
              className="text-gray-600 cursor-pointer"
            />
          )}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleGoHome}
          >
            <PropManagerLogoIcon variant="light" className="w-10 h-10" />
            <PropManagerLogoText className="text-2xl font-bold" />
          </div>
        </div>

        {/* Right section: auth-based content */}
        <div className="flex items-center gap-4">
          {currentUser && profileData && authUser ? (
            <>
              <BellIcon
                hasNotifications={true}
                className="text-gray-600 cursor-pointer"
                onClick={toggleNotificationDropdown}
              />
              <div className="relative">
                {/* Notification Board */}
                <NotificationBellDropdown
                  open={isNotificationDropdownOpen}
                  onClose={() => setIsNotificationDropdownOpen(false)}
                  tasks={upcomingTasks}
                  conversations={conversations}
                />
              </div>
              <div className="cursor-pointer" onClick={handleGoProfile}>
                <ProfileFooter
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                  title={authUser.role || "User"}
                />
              </div>
              <Button variant="outline" className="cursor-pointer" onClick={handleSignout}>
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/signin">
                <Button>Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
