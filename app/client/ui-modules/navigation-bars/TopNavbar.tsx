import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
import { useAppSelector, useAppDispatch } from "/app/client/store";
import { ProfileFooter } from "../navigation-bars/side-nav-bars/components/ProfileFooter";
import { signoutUser } from "../user-authentication/state/reducers/current-user-slice";
import { NotificationBoard } from "../theming/components/NotificationBoard";
import { selectTasks as selectAgentTasks, fetchAgentTasks } from "../role-dashboard/agent-dashboard/state/agent-dashboard-slice";
import { selectTasks as selectTenantTasks, fetchTenantTasks } from "../role-dashboard/tenant-dashboard/state/tenant-dashboard-slice";
import { selectTasks as selectLandlordTasks, fetchLandlordTasks } from "../role-dashboard/landlord-dashboard/state/landlord-dashboard-slice";
import { Role } from "/app/shared/user-role-identifier";

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

  const upcomingTasks = authUser?.role === 'agent' ? agentTasks : authUser?.role === 'tenant' ? tenantTasks : authUser?.role === 'landlord' ? landlordTasks : [];

  useEffect(() => {
    if (authUser?.userId) {
      switch (authUser.role) {
        case Role.AGENT:
          dispatch(fetchAgentTasks(authUser.userId));
          break;
        case Role.TENANT:
          dispatch(fetchTenantTasks(authUser.userId));
          break;
        case Role.LANDLORD:
          dispatch(fetchLandlordTasks(authUser.userId));
          break;
        default:
          // Handle other roles or no role if necessary
          break;
      }
    }
  }, [dispatch, authUser?.userId, authUser?.role]);

  const handleSignout = async () => {
    try {
      await dispatch(signoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleGoHome = () => navigate("/");
  const handleGoProfile = () => navigate("/profile");

  const [isNotificationBoardOpen, setIsNotificationBoardOpen] = useState(false);

  const toggleNotificationBoard = () => {
    setIsNotificationBoardOpen((prev) => !prev);
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
                onClick={toggleNotificationBoard}
              />
              <div className="relative">
                {/* Notification Board */}
                <NotificationBoard
                  open={isNotificationBoardOpen}
                  onClose={() => setIsNotificationBoardOpen(false)}
                  tasks={upcomingTasks}
                />
              </div>
              <div className="cursor-pointer" onClick={handleGoProfile}>
                <ProfileFooter
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                  title={authUser.role || "User"}
                />
              </div>
              <Button variant="outline" onClick={handleSignout}>
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
