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
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";

export function PropertyForm({
  form,
  onSubmit,
  landlords,
}: {
  form: UseFormReturn<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => void;
  landlords: ApiLandlord[];
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBasicInformation form={form} landlords={landlords}/>
        <FormPropertyDetails form={form} />
        <FormPropertyImages form={form} />
        <FormListingOptions form={form} />
        <div className="flex justify-end mt-5">
        <Button type="submit">Create Listing</Button>
        </div>
      </form>
    </Form>
  );
}


export const formDefaultValues: z.infer<typeof formSchema> = {
  landlord: "",
  property_type: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  apartment_number: "",
  monthly_rent: 0,
  bond: 0,
  bedroom_number: 0,
  bathroom_number: 0,
  space: 0,
  description: "",
  amenities: "",
  images: [],
  available_dates: new Date(),
  lease_term: "",
  show_contact_boolean: false,
};
