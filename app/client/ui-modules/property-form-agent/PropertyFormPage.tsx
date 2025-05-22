"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { PropertyForm } from "./components/PropertyForm";
import { formSchema, FormSchemaType } from "./components/FormSchema";
import { formDefaultValues } from "./components/PropertyForm";
import { uploadFilesHandler } from "../../library-modules/apis/azure/blob-api";
import { BlobNamePrefix, UploadResults } from "/app/shared/azure/blob-models";
import { apiInsertPropertyListing } from "../../library-modules/apis/property-listing/listing-api";

export function PropertyFormPage() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const onClick = () => {
    console.log("Attempting to return to previous route.");
  };

  const handleSubmit = async (values: FormSchemaType) => {
    console.log("Form submitted!", values);
    // const uploadReturnValues: UploadResults = await uploadFilesHandler(values.images,BlobNamePrefix.PROPERTY)
    // console.log(uploadReturnValues)
    // const imageUrls: string[] = uploadReturnValues.success.map((uploadResult) => {return uploadResult.url})
    // console.log(await apiInsertPropertyListing("999",imageUrls)) <- Insert the property_id in place of 999
  };

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
          <PropertyForm onSubmit={handleSubmit} form={form} />
      </div>
    </div>
  );
}
