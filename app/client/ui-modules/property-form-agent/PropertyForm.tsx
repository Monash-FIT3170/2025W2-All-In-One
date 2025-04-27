"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "../theming/components/shadcn/Form";
import BasicInformation from "./components/BasicInformation";
import PropertyDetails from "./components/PropertyDetails";
import PropertyImages from "./components/PropertyImages";
import ListingOptions from "./components/ListingOptions";
import { Button } from "../theming/components/shadcn/Button";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeading } from "./components/PageHeading";

export const formSchema = z.object({
  landlord: z.string(),
  property_type: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string().length(4, {message: "Post code must be 4 digits long"}),
  apartment_number: z.string().optional(),
  monthly_rent: z.coerce.number().min(0),
  bond: z.coerce.number().min(0),
  bedroom_number: z.coerce.number().min(0),
  bathroom_number: z.coerce.number().min(0),
  space: z.coerce.number().min(0),
  description: z.string(),
  amenities: z.string(),
  images: z.string(),
  available_dates: z.coerce.date(),
  lease_term: z.string(),
  show_contact_boolean: z.boolean().optional()
});

export function PropertyForm(): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      images: "",
      available_dates: new Date(),
      lease_term: "",
      show_contact_boolean: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
  };

  const onClick = () => {
    console.log("Button pressed!")
  }

  return (
    <div className="mt-6 ml-10">
      <div className="flex flex-col items-start">
      <button onClick={onClick} className="flex items-center text-[#71717A] mb-2 gap-2 text-sm hover:underline">
      <ArrowLeftIcon className="scale-75"/> <span className="text-md">Back to Properties</span>
      </button>
      <PageHeading title="Property Listing" subtitle="Create a new rental property listing for a landlord" className=""/>
      </div>

    <div className="max-w-3xl mx-auto px-6 py-10 rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <BasicInformation form={form} />
        <PropertyDetails form={form} />
        <PropertyImages form={form}/>
        <ListingOptions form={form}/>
        
        <div className="flex justify-end">
          <Button variant="black" onClick={() => onSubmit}>Create Listing</Button>
        </div>
      </form>
    </Form>
    </div>
    </div>
  );
}
