import React from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  resetProfile,
  selectIsEditing,
  selectProfileData,
  setEditing,
  updateField,
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
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ContactInfoCard } from "./components/ContactInfoCard";
import { EmploymentInfoCard } from "./components/EmploymentInfoCard";
import { CardWidget } from "./components/CardWidget";

export function ProfilePage(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const [tempProfileImage, setProfileImage] = React.useState<string | null>(
    null
  );

  const [localProfile, setLocalProfile] = React.useState(profile);
  // NEED TO MAKE A "Local profile" so that u can make multiple changes without saving until the btn is pressed
  React.useEffect(() => {
    if (isEditing) {
      setLocalProfile(profile); // clone the latest profile when edit mode begins
    }
  }, [isEditing, profile]);

  const handleSave = () => {
    Object.entries(localProfile).forEach(([field, value]) =>
      dispatch(
        updateField({ field: field as keyof typeof localProfile, value })
      )
    );
    dispatch(setEditing(false));
  };

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
              {isEditing ? (
                <>
                  <Button
                    onClick={() => dispatch(setEditing(false))}
                    className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                  >
                    Cancel Edit
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                  >
                    Save Profile
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => dispatch(setEditing(true))}
                  className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="col-span-full flex justify-end"></div>
            <PersonalInfoCard
              profile={isEditing ? localProfile : profile}
              isEditing={isEditing}
              onChange={(field, value) =>
                setLocalProfile((prev) => ({ ...prev, [field]: value }))
              }
            />
            {/*TODO: add switch statements to change information based on users role i.e agent  */}
            <ContactInfoCard
              profile={isEditing ? localProfile : profile}
              isEditing={isEditing}
              onChange={(field, value) =>
                setLocalProfile((prev) => ({ ...prev, [field]: value }))
              }
            />
            <EmploymentInfoCard
              profile={isEditing ? localProfile : profile}
              isEditing={isEditing}
              onChange={(field, value) =>
                setLocalProfile((prev) => ({ ...prev, [field]: value }))
              }
            />
            <CardWidget
              title="Vehicle Information"
              value=""
              subtitle="Registered vehicles for parking"
            >
              {/*TODO: decide and implement table for vehicle registration */}
            </CardWidget>
          </div>
        </div>
      </div>
    </div>
  );
}
