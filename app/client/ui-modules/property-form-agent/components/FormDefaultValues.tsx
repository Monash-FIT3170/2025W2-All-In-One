import React from "react";
import { z } from "zod";
import { formSchema } from "../PropertyForm";

export const FormDefaultValue: z.infer<typeof formSchema> = {
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
}