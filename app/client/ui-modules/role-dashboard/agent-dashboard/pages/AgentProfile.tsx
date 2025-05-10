import React from "react";
import { AgentTopNavbar } from "../../../navigation-bars/TopNavbar";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { agentDashboardLinks, settingLinks } from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { ProfileCard } from "../components/ProfileCard";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { selectIsEditing, selectProfileData } from "../state/profile-slice";
import { EditableAvatar } from "../components/EditableAvatar";

export function AgentProfile(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const [tempProfileImage, setProfileImage] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <AgentTopNavbar onSideBarOpened={onSideBarOpened} />
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={agentDashboardLinks}
          settingsLinks={settingLinks}
        />

       

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <EditableAvatar 
        
              editing={isEditing}
              imageUrl = {tempProfileImage ?? profile.profileImage}
              onImageChange= {(file) => {
                const imageUrl = URL.createObjectURL(file);
                setProfileImage(imageUrl)
              }}

  />


          </div>
          <h2 className="text-2xl font-bold mb-6">{profile.firstName} {profile.lastName}</h2>
          <p className="text-m text-muted-foreground">Agent since ...</p>
          
          <ProfileCard/>
        </div>
      </div>
    </div>
  );
}