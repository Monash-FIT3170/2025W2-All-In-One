"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Form } from "../../theming-shadcn/Form";
import FormBasicInformation from "./FormBasicInformation";
import FormPropertyDetails from "./FormPropertyDetails";
import FormPropertyImages from "./FormPropertyImages";
import FormListingOptions from "./FormListingOptions";
import { formSchema, FormSchemaType } from "./FormSchema";
import { Button } from "../../theming-shadcn/Button";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFormMode } from "../enum/PropertyFormMode";

export function PropertyForm({
  form,
  onSubmit,
  landlords,
  features,
  mode = PropertyFormMode.CREATE,
}: {
  form: UseFormReturn<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => void;
  landlords: (Landlord & { firstName: string; lastName: string })[];
  features: { value: string; label: string }[];
  mode: PropertyFormMode;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBasicInformation form={form} landlords={landlords} />
        <FormPropertyDetails form={form} features={features} />
        <FormPropertyImages form={form} />
        <FormListingOptions form={form} />
        <div className="flex justify-end mt-5">
          <Button type="submit">
            {mode === PropertyFormMode.CREATE
              ? "Create Listing"
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const formDefaultValues: z.infer<typeof formSchema> = {
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
  space: 0,
  description: "",
  property_feature_ids: [],
  images: [],
  available_dates: new Date(),
  lease_term: "",
  show_contact_boolean: false,
};
