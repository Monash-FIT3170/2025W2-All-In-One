import React from "react";
import { CardWidget } from "./CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../agent-dashboard/state/profile-slice";
import { EditableField } from "./EditableField";
import { useAppDispatch, useAppSelector } from "/app/client/store";

interface Props {
  profile: {
    firstName: string;
    lastName: string;
    dob: string;
    occupation: string;
  };

  isEditing: boolean;
  onChange: (field: keyof Props["profile"], value: string) => void;
}

export function PersonalInfoCard({ profile, isEditing, onChange }: Props) {
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
          onChange={(val) => onChange("firstName", val)}
        />
        <EditableField
          label="Last Name"
          value={profile.lastName}
          editing={isEditing}
          onChange={(val) => onChange("lastName", val)}
        />
      </div>
      <EditableField
        label="Date of Birth"
        value={profile.dob}
        editing={isEditing}
        onChange={(val) => onChange("dob", val)}
      />
      <EditableField
        label="Occupation"
        value={profile.occupation}
        editing={isEditing}
        onChange={(val) => onChange("occupation", val)}
      />
    </CardWidget>
  );
}
