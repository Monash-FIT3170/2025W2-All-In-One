import React from "react";
import { CardWidget } from "./CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../agent-dashboard/state/profile-slice";
import { EditableField } from "./EditableField";
import { useAppDispatch, useAppSelector } from "/app/client/store";

export function ContactInfoCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const handleFieldChange =
    (field: keyof typeof profile) => (value: string) => {
      dispatch(updateField({ field, value }));
    };

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
        onChange={handleFieldChange("email")}
      />
      <EditableField
        label="Phone Number"
        value={profile.phone}
        editing={isEditing}
        onChange={handleFieldChange("phone")}
      />
      <EditableField
        label="Emergency Contact"
        value={profile.emergencyContact}
        editing={isEditing}
        onChange={handleFieldChange("emergencyContact")}
      />
    </CardWidget>
  );
}
