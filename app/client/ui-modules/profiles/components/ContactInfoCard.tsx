import React from "react";
import { CardWidget } from "../../common/CardWidget";
import {
  selectIsEditing,
  selectProfileData,
  updateField,
} from "../state/profile-slice";
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
  errors: Record<string, string>;
}

export function ContactInfoCard({
  profile,
  isEditing,
  onChange,
  errors,
}: Props) {
  const fields: {
    label: string;
    key: keyof Props["profile"];
    type?: string;
  }[] = [
    { label: "Email Address *", key: "email", type: "string" },
    { label: "Phone Number *", key: "phone", type: "string" },
    { label: "Emergency Contact", key: "emergencyContact", type: "string" },
  ];

  return (
    <CardWidget
      title="Contact Information"
      className={
        isEditing ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }
      value=""
      subtitle="How we can reach you"
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
            error={errors[key]}
          />
        ))}
      </div>
    </CardWidget>
  );
}
