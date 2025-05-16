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
  const fields: {
    label: string;
    key: keyof Props["profile"];
    type?: string;
  }[] = [
    { label: "Current Employer", key: "employer", type: "string" },
    { label: "Working Address", key: "workAddress", type: "string" },
    { label: "Work Phone", key: "workPhone", type: "string" },
  ];
  return (
    <CardWidget
      title="Employment Information"
      value=""
      subtitle="Your current employment details"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, key, type }) => (
          <EditableField
            label={label}
            value={profile[key]}
            editing={isEditing}
            onChange={(val) => onChange(key, val)}
            type={type}
          />
        ))}
      </div>
    </CardWidget>
  );
}
