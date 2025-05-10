import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { EditableField } from "./EditableField";
import { Button } from "../../../theming-shadcn/Button";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectProfileData,
  selectIsEditing,
  setEditing,
  updateField,
} from "../state/profile-slice";

export function ProfileCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileData);
  const isEditing = useAppSelector(selectIsEditing);

  const handleFieldChange =
    (field: keyof typeof profile) => (value: string) => {
      dispatch(updateField({ field, value }));
    };

  const handleEditToggle = () => {
    dispatch(setEditing(!isEditing));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="col-span-full flex justify-end"></div>

      <CardWidget
        title="Personal Information"
        value=""
        subtitle="your basic personal information"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField
            label="First Name"
            value={profile.firstName}
            editing={isEditing}
            onChange={handleFieldChange("firstName")}
          />
          <EditableField
            label="Last Name"
            value={profile.lastName}
            editing={isEditing}
            onChange={handleFieldChange("lastName")}
          />
        </div>
        <EditableField
          label="Date of Birth"
          value={profile.dob}
          editing={isEditing}
          onChange={handleFieldChange("dob")}
        />
        <EditableField
          label="Occupation"
          value={profile.occupation}
          editing={isEditing}
          onChange={handleFieldChange("occupation")}
        />
      </CardWidget>

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

      <CardWidget
        title="Vehicle Information"
        value=""
        subtitle="Registered vehicles for parking"
      >
        {/* Add vehicle fields here when needed */}
      </CardWidget>
    </div>
  );
}
