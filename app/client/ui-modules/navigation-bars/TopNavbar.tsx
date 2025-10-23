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

import {
  fetchNotificationTasks,
  updateNotificationConversations,
  selectNotificationTasks,
  selectUnreadMessageCount,
} from "../theming/state/notification-slice";
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
  
  React.useEffect(() => {
    console.log("TopNavbar profileData:", profileData);
  }, [profileData]);
  const notificationTasks = useAppSelector(selectNotificationTasks);
  const unreadMessageCount = useAppSelector(selectUnreadMessageCount);

  // Load conversations and notification data globally when user is authenticated
  React.useEffect(() => {
    if (authUser?.userId && authUser?.role) {
      dispatch(fetchNotificationTasks());
      dispatch(updateNotificationConversations());
    }
  }, [authUser?.userId, authUser?.role, dispatch]);

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

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

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
                hasNotifications={notificationTasks.length > 0 || unreadMessageCount > 0}
                className="text-gray-600 cursor-pointer"
                onClick={() => setIsNotificationDropdownOpen((prev) => !prev)}
              />
              <div className="relative">
                {/* Notification Board */}
                <NotificationBellDropdown
                  open={isNotificationDropdownOpen}
                  onClose={() => setIsNotificationDropdownOpen(false)}
                />
              </div>
              <div className="cursor-pointer" onClick={handleGoProfile}>
                <ProfileFooter
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                  title={authUser.role || "User"}
                  profileImage={profileData.profilePicture}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleSignout}
                className="cursor-pointer hover:bg-red-300 hover:border-red-400 transition-colors duration-200"
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/signin">
                <Button className="hover:bg-gray-500 transition-colors duration-200">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="outline"
                  className="hover:bg-gray-200 transition-colors duration-200"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
