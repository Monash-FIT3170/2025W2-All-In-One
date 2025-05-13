import React from "react";
import { CardWidget } from "./CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../agent-dashboard/state/profile-slice";
import { EditableField } from "./EditableField";
import { useAppDispatch, useAppSelector } from "/app/client/store";

export function PersonalInfoCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const handleFieldChange =
    (field: keyof typeof profile) => (value: string) => {
      dispatch(updateField({ field, value }));
    };

  return (
    <CardWidget
      title="Personal Information"
      value=""
      subtitle="your basic personal information"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableField
          label="First Name"
          value={profile.firstName}
          editing={isEditing}
          onChange={handleFieldChange("firstName")}
        />
        <EditableField
          label="Last Name"
          value={profile.lastName}
          editing={isEditing}
          onChange={handleFieldChange("lastName")}
        />
      </div>
      <EditableField
        label="Date of Birth"
        value={profile.dob}
        editing={isEditing}
        onChange={handleFieldChange("dob")}
      />
      <EditableField
        label="Occupation"
        value={profile.occupation}
        editing={isEditing}
        onChange={handleFieldChange("occupation")}
      />
    </CardWidget>
  );
}
