import React from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  resetProfile,
  selectIsEditing,
  selectProfileData,
  setEditing,
} from "./agent-dashboard/state/profile-slice";
import { AgentTopNavbar } from "../navigation-bars/TopNavbar";
import { RoleSideNavBar } from "../navigation-bars/side-nav-bars/SideNavbar";
import {
  agentDashboardLinks,
  settingLinks,
} from "../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { EditableAvatar } from "./components/EditableAvatar";
import { Button } from "../theming-shadcn/Button";
import { ProfileCard } from "./components/ProfileCard";

export function ProfilePage(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const [tempProfileImage, setProfileImage] = React.useState<string | null>(
    null
  );

  const handleEditToggle = () => {
    dispatch(setEditing(!isEditing));
  };

  // NEED TO MAKE A "Local profile" so that u can make multiple changes without saving until the btn is pressed

  return (
    <div className="min-h-screen">
      <AgentTopNavbar onSideBarOpened={onSideBarOpened} />{" "}
      {/*TODO: add switch statements to change nav bars based on users role i.e agent  */}
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={agentDashboardLinks}
          settingsLinks={settingLinks}
        />

        <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-4">
              <EditableAvatar
                editing={isEditing}
                imageUrl={tempProfileImage ?? profile.profileImage}
                onImageChange={(file) => {
                  const imageUrl = URL.createObjectURL(file);
                  setProfileImage(imageUrl);
                }}
              />

              <div className="mt-[10px]">
                <h2 className="text-xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">Agent since ...</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-white text-black px-2 py-1 rounded-full border border-gray-400">
                    Verified Agent{" "}
                    {/*TODO: add switch statements to change nav bars based on users role i.e agent  */}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              {isEditing && (
                <Button
                  onClick={() => dispatch(resetProfile())}
                  className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                >
                  Cancel Edit
                </Button>
              )}
              <Button
                onClick={handleEditToggle}
                className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </div>
          </div>

          <ProfileCard />
        </div>
      </div>
    </div>
  );
}
