import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { EditableField } from "./EditableField";


export function ProfileCard() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <CardWidget
          title="Personal Information"
          value=""
          subtitle="your basic personal information"
        >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField label="First Name" text="Tom"></EditableField>
                <EditableField label="Last Name" text="Macauley"></EditableField>

            </div>

            <EditableField label="Date of Birth" text="25/09/2003"></EditableField>
            <EditableField label="Occupation" text="Student"></EditableField>
        
        </CardWidget>
        
        <CardWidget
          title="Contact Information"
          value=""
          subtitle="How we can reach you"
        >
            
            
            <EditableField label="Email Address" text="thomas123mac@gmail.com"></EditableField>
            <EditableField label="Phone Number" text="0437 559 777"></EditableField>
            <EditableField label="Emergency Contact" text="Thomas Higgins (Bestest Friend) - (000)"></EditableField> 
            
        
        </CardWidget>

        <CardWidget
          title="Employment Information"
          value=""
          subtitle="Your current employment details"
        >

            
            <EditableField label="Current Employer" text="Fit 3170"></EditableField>
            <EditableField label="Working Address" text="Learning Jungle"></EditableField>
            <EditableField label="Work Phone" text="0437 559 777"></EditableField>

        
        </CardWidget>

        <CardWidget
          title="Vehicle Information"
          value=""
          subtitle="Registered vehicles for parking"
        >

        
        </CardWidget>
       
      </div>
    );
  }