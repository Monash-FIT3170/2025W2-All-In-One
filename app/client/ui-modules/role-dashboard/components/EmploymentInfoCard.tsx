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
    employer: string;
    workAddress: string;
    workPhone: string;
  };

  isEditing: boolean;
  onChange: (field: keyof Props["profile"], value: string) => void;
}

export function EmploymentInfoCard({ profile, isEditing, onChange }: Props) {
  return (
    <CardWidget
      title="Employment Information"
      value=""
      subtitle="Your current employment details"
    >
      <EditableField
        label="Current Employer"
        value={profile.employer}
        editing={isEditing}
        onChange={(val) => onChange("employer", val)}
      />
      <EditableField
        label="Working Address"
        value={profile.workAddress}
        editing={isEditing}
        onChange={(val) => onChange("workAddress", val)}
      />
      <EditableField
        label="Work Phone"
        value={profile.workPhone}
        editing={isEditing}
        onChange={(val) => onChange("workPhone", val)}
      />
    </CardWidget>
  );
}
