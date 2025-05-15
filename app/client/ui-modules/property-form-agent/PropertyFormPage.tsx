"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { PropertyForm } from "./components/PropertyForm";
import { formSchema, FormSchemaType } from "./components/FormSchema";
import { formDefaultValues } from "./components/PropertyForm";
import { uploadFilesHandler } from "../../library-modules/apis/azure/blob-api";

export function PropertyFormPage() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const onClick = () => {
    console.log("Attempting to return to previous route.");
  };

  const handleSubmit = (values: FormSchemaType) => {
    uploadFilesHandler(values.images,"today")
    console.log("Form submitted!", values);
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
