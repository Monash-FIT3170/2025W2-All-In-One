import React from "react";
import { CardWidget } from "./CardWidget";
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
    return (
        <CardWidget
            title="Vehicle Information"
            value=""
            subtitle="Registered vehicle for parking"
        >
            <EditableField
                label="Make"
                value={profile.carMake}
                editing={isEditing}
                onChange={(val) => onChange("carMake", val)}
            />
            <EditableField
                label="Model"
                value={profile.carModel}
                editing={isEditing}
                onChange={(val) => onChange("carModel", val)}
            />
            <EditableField
                label="Year"
                value={profile.carYear}
                editing={isEditing}
                onChange={(val) => onChange("carYear", val)}
            />
            <EditableField
                label="License Plate"
                value={profile.carPlate}
                editing={isEditing}
                onChange={(val) => onChange("carPlate", val)}
            />
        </CardWidget>
    );
}
