import React from "react";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { PropManagerLogoIcon } from "../theming/components/logo/PropManagerLogoIcon";
import { PropManagerLogoText } from "../theming/components/logo/PropManagerLogoText";
import { Button } from "../theming-shadcn/Button";
import { BellIcon } from "../theming/icons/BellIcon";
import { SideBarSliderIcon } from "../theming/icons/SideBarSlider";
import { useAppSelector } from "/app/client/store";
import { ProfileFooter } from "../navigation-bars/side-nav-bars/components/ProfileFooter";
// import { logoutUser } from "/app/client/store/authSlice";

interface TopNavbarProps {
  onSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TopNavbar({ onSideBarOpened }: TopNavbarProps): React.JSX.Element {
  const dispatch = useDispatch();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const handleLogout = () => {
    console.log("LOGOUT TO BE DONE LATER !!");
    // dispatch(logoutUser());
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-2">
      <div className="flex justify-between items-center px-4">
        {/* Left section: hamburger + logo */}
        <div className="flex items-center gap-4">
          <SideBarSliderIcon
            onClick={() => onSideBarOpened((prev) => !prev)}
            className="text-gray-600 cursor-pointer"
          />
          <div className="flex items-center gap-2 cursor-pointer">
            <PropManagerLogoIcon variant="light" className="w-10 h-10" />
            <PropManagerLogoText className="text-2xl font-bold" />
          </div>
        </div>

        {/* Right section: auth-based display */}
        <div className="flex items-center gap-4">
          {currentUser && authUser ? (
            <>
              <BellIcon
                hasNotifications={true}
                className="text-gray-600"
                onClick={() => console.log("Notification clicked")}
              />
              <ProfileFooter
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                title={authUser.role || "User"}
              />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
