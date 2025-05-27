import React from "react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../state/profile-slice";
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
  const fields: {
    label: string;
    key: keyof Props["profile"];
    type?: string;
  }[] = [
    { label: "First Name", key: "firstName", type: "string" },
    { label: "Last Name", key: "lastName", type: "string" },
    { label: "Date of Birth", key: "dob", type: "date" },
    { label: "Occupation", key: "occupation", type: "string" },
  ];

  return (
    <CardWidget
      title="Personal Information"
      value=""
      subtitle="your basic personal information"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, key, type }) => (
          <EditableField
            key={key}
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
