import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { ProfileFooter } from "../navigation-bars/side-nav-bars/components/ProfileFooter";
import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiTask } from '/app/shared/api-models/task/ApiTask';
import { current } from "@reduxjs/toolkit";
import { NotificationBoard } from "../theming/components/NotificationBoard";
import {
  fetchAgentTasks,
  selectProperties,
  selectTasks,
} from "../role-dashboard/agent-dashboard/state/agent-dashboard-slice";
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
          <PropManagerLogoIcon variant="light" className="w-10 h-10" />
          <PropManagerLogoText className="text-2xl font-bold" />
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

// This top navbar can be used by all roles
export function RoleTopNavbar({
  onSideBarOpened,
}: TopNavbarProps): React.JSX.Element {
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const firstName = currentUser?.firstName || "Unknown";
  const lastName = currentUser?.lastName || "User";
  const [notificationOpen, setNotificationOpen] = useState(false);
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();

  const getUserRole = () => {
    if (!currentUser) return "Guest";
    if ('agentId' in currentUser) return "Agent";
    if ('landlordId' in currentUser) return "Landlord";
    if ('tenantId' in currentUser) return "Tenant";
    return "Guest";
  };

  const handleBellClick = async () => {
    if (!notificationOpen && currentUser?.userAccountId) {
      dispatch(fetchAgentTasks(currentUser.userAccountId));
    }
    setNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
      if (currentUser?.userAccountId) {
        dispatch(fetchAgentTasks(currentUser.userAccountId));
      }
    }, [dispatch, currentUser?.userAccountId]);

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
            <PropManagerLogoIcon variant="light" className="w-10 h-10" />
            <PropManagerLogoText className="text-2xl font-bold" />
          </div>
        </div>

        {/* Right-aligned profile section */}
        <div className="flex items-center gap-4">
          <div className="ml-2">
            <BellIcon
              hasNotifications={tasks.length > 0}
              className="text-gray-600"
              onClick={handleBellClick}
            />
            <NotificationBoard
              open={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              tasks={tasks}
            />
          </div>
          <ProfileFooter firstName={firstName} lastName={lastName} title={getUserRole()} />
        </div>
      </div>
    </header>
  );
}
