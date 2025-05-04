"use client";

/**
 *
 * missing props. Should contain onSubmit here, with the form object passed in. I assume the form object contains the values entered in the form (correct me if im wrong).
 * Any events tied to business data that will need to be read or manipulated should passed upwards. Also i dont see a form page component anywhere. The page and the form itself should be seperate components
 * pass up into props (onSubmit onClick)
 * use map() function for FormBasicInformation
 * delete cn function and use tailwindMerge
 */
import React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Form } from "../../theming/components/shadcn/Form";
import FormBasicInformation from "./FormBasicInformation";
import FormPropertyDetails from "./FormPropertyDetails";
import FormPropertyImages from "./FormPropertyImages";
import FormListingOptions from "./FormListingOptions";
import { formSchema, FormSchemaType } from "./FormSchema";
import { Button } from "../../theming/components/shadcn/Button";

export function PropertyForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBasicInformation form={form} />
        <FormPropertyDetails form={form} />
        <FormPropertyImages form={form} />
        <FormListingOptions form={form} />
        <div className="flex justify-end mt-5">
        <Button variant="black" type="submit">Create Listing</Button>
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
