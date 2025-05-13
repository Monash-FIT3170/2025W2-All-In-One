import React from "react";
import { CardWidget } from "./CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../agent-dashboard/state/profile-slice";
import { EditableField } from "./EditableField";
import { useAppDispatch, useAppSelector } from "/app/client/store";

export function EmploymentInfoCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const handleFieldChange =
    (field: keyof typeof profile) => (value: string) => {
      dispatch(updateField({ field, value }));
    };

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
        onChange={handleFieldChange("employer")}
      />
      <EditableField
        label="Working Address"
        value={profile.workAddress}
        editing={isEditing}
        onChange={handleFieldChange("workAddress")}
      />
      <EditableField
        label="Work Phone"
        value={profile.workPhone}
        editing={isEditing}
        onChange={handleFieldChange("workPhone")}
      />
    </CardWidget>
  );
}
