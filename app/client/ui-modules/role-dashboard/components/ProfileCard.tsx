import React from "react";
import { CardWidget } from "./CardWidget";
import { EditableField } from "./EditableField";
import { Button } from "../../theming-shadcn/Button";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  selectProfileData,
  selectIsEditing,
  setEditing,
  updateField,
} from "../agent-dashboard/state/profile-slice";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { ContactInfoCard } from "./ContactInfoCard";
import { EmploymentInfoCard } from "./EmploymentInfoCard";

export function ProfileCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const handleFieldChange =
    (field: keyof typeof profile) => (value: string) => {
      dispatch(updateField({ field, value }));
    };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="col-span-full flex justify-end"></div>
      <PersonalInfoCard />{" "}
      {/*TODO: add switch statements to change information based on users role i.e agent  */}
      <ContactInfoCard />
      <EmploymentInfoCard />
      <CardWidget
        title="Vehicle Information"
        value=""
        subtitle="Registered vehicles for parking"
      >
        {/*TODO: decide and implement table for vehicle registration */}
      </CardWidget>
    </div>
  );
}
