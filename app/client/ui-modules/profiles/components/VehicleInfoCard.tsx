import React from "react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import { EditableField } from "./EditableField";
interface Props {
  profile: {
    carMake: string;
    carModel: string;
    carYear: string;
    carPlate: string;
  };

  isEditing: boolean;
  onChange: (field: keyof Props["profile"], value: string) => void;
}
// 86cyrzxwu

export function VehicleInfoCard({ profile, isEditing, onChange }: Props) {
  const fields: {
    label: string;
    key: keyof Props["profile"];
    type?: string;
  }[] = [
    { label: "Make", key: "carMake", type: "string" },
    { label: "Model", key: "carModel", type: "string" },
    { label: "Year", key: "carYear", type: "string" },
    { label: "License Playe", key: "carPlate", type: "string" },
  ];
  return (
    <CardWidget
      title="Vehicle Information"
      value=""
      subtitle="Registered vehicle for parking"
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
