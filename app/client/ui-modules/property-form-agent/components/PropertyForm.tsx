"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Form } from "../../theming-shadcn/Form";
import FormBasicInformation from "./FormBasicInformation";
import FormPropertyDetails from "./FormPropertyDetails";
import FormPropertyImages, { FormPropertyImagesRef } from "./FormPropertyImages";
import FormListingOptions from "./FormListingOptions";
import { formSchema, FormSchemaType } from "./FormSchema";
import { Button } from "../../theming-shadcn/Button";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFormMode } from "../enum/PropertyFormMode";
import { ImageOrderItem } from "../enum/ImageType";

export interface PropertyFormRef {
  loadExistingImages: (urls: string[]) => void;
  getCombinedImages: () => { existingImages: string[]; newImages: File[]; imageOrder: ImageOrderItem[] };
}

export const PropertyForm = forwardRef<PropertyFormRef, {
  form: UseFormReturn<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => void;
  landlords: (Landlord & { firstName: string; lastName: string })[];
  features: { value: string; label: string }[];
  mode: PropertyFormMode;
}>(({ form, onSubmit, landlords, features, mode }, ref) => {
  const formPropertyImagesRef = useRef<FormPropertyImagesRef>(null);

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    loadExistingImages: (urls: string[]) => {
      formPropertyImagesRef.current?.addExistingImages(urls);
    },
    getCombinedImages: () => {
      return formPropertyImagesRef.current?.getCombinedImages() || { existingImages: [], newImages: [], imageOrder: [] };
    }
  }));
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBasicInformation form={form} landlords={landlords} />
        <FormPropertyDetails form={form} features={features} />
        <FormPropertyImages ref={formPropertyImagesRef} form={form} />
        <FormListingOptions form={form} />
        <div className="flex justify-end mt-5">
          <Button 
            type="submit"
          >
            {mode === PropertyFormMode.CREATE
              ? "Create Listing"
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
});

PropertyForm.displayName = 'PropertyForm';

export const formDefaultValues: z.infer<typeof formSchema> = {
  agent: "",
  landlord: "",
  property_type: "",
  address_number: "",
  address: "",
  suburb: "",
  city: "",
  state: "",
  postal_code: "",
  apartment_number: "",
  monthly_rent: 0,
  bedroom_number: 0,
  bathroom_number: 0,
  parking_spaces: 0,
  space: 0,
  description: "",
  summary_description: "",
  property_feature_ids: [],
  images: [],
  startlease_date: new Date(),
  endlease_date: new Date(),
  inspection_times: [],
  lease_term: "",
};
