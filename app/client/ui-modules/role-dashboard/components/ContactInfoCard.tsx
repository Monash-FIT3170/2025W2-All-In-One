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
    email: string;
    phone: string;
    emergencyContact: string;
  };

  isEditing: boolean;
  onChange: (field: keyof Props["profile"], value: string) => void;
}

export function ContactInfoCard({ profile, isEditing, onChange }: Props) {
  return (
    <CardWidget
      title="Contact Information"
      value=""
      subtitle="How we can reach you"
    >
      <EditableField
        label="Email Address"
        value={profile.email}
        editing={isEditing}
        onChange={(val) => onChange("email", val)}
      />
      <EditableField
        label="Phone Number"
        value={profile.phone}
        editing={isEditing}
        onChange={(val) => onChange("phone", val)}
      />
      <EditableField
        label="Emergency Contact"
        value={profile.emergencyContact}
        editing={isEditing}
        onChange={(val) => onChange("emergencyContact", val)}
      />
    </CardWidget>
  );
}
