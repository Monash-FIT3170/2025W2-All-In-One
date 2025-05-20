"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { PropertyForm } from "./components/PropertyForm";
import { formSchema, FormSchemaType } from "./components/FormSchema";
import { formDefaultValues } from "./components/PropertyForm";
import { PropertyDocument } from "/app/server/database/property/models/PropertyDocument";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyStatusName } from "/app/shared/api-models/property/PropertyStatus";
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";

export function PropertyFormPage() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const onClick = () => {
    console.log("Attempting to return to previous route.");
  };

  const handleSubmit = (values: FormSchemaType) => {
    const addressParts = values.address.trim().split(" ");

    const amenitiesList = values.amenities
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  
    const insertDoc: Omit<PropertyDocument, "_id"> = {
      streetnumber: addressParts[0],
      streetname: addressParts.slice(1).join(" "),
      suburb: values.city,
      province: values.state,
      postcode: values.postal_code,
      property_status_id: PropertyStatusName.VACANT,
      description: values.description,
      summary_description: values.description.slice(0, 60),
      bathrooms: values.bathroom_number,
      bedrooms: values.bedroom_number,
      parking: 0,
      property_feature_ids: amenitiesList, // Currently accepting id: not the actual name.
      type: values.property_type,
      area: values.space,
      agent_id: "", // not collected yet
      landlord_id: values.landlord,
      tenant_id: "", // not collected yet
    };
  
    Meteor.call(MeteorMethodIdentifier.PROPERTY_INSERT, insertDoc, (err: Meteor.Error | null, propertyId: string | undefined)=> {
      if (err) {
        console.error("Insert failed", err);
      } else {
        console.log("Property inserted with ID:", propertyId);
      }
    });
  };
  
  const [landlords, setLandlords] = useState<ApiLandlord[]>([]);

  useEffect(() => {
    Meteor.call(
      MeteorMethodIdentifier.LANDLORD_GET_ALL,
      (err: Meteor.Error | null, res: ApiLandlord[]) => {
        if (err) {
          console.error("Failed to fetch landlords:", err);
        } else {
          console.log("✅ Received landlords:", res); // <- Add this
          setLandlords(res);
        }
      }
    );
  }, []);
  
  
  return (
    <div className="mt-6 ml-10">
      <div className="flex flex-col items-start">
        <button
          onClick={onClick}
          className="flex items-center text-[#71717A] mb-2 gap-2 text-sm hover:underline"
        >
          <ArrowLeftIcon className="scale-75" />
          <span className="text-md">Back to Properties</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold mb-1">Property Listing</h1>
          <h3 className="text-sm text-[#71717A]">
            Create a new rental property listing for a landlord
          </h3>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 rounded-md space-y-10">
          <PropertyForm onSubmit={handleSubmit} form={form} landlords={landlords} />
      </div>
    </div>
  );
}
