import * as z from "zod";

export const formSchema = z.object({
  landlord: z.string().min(1, { message: "Please assign a landlord" }),
  property_type: z.string().min(1, { message: "Please select a property type" }),
  address_number: z.string().min(1, { message: "Please fill out field" }),
  address: z.string().min(1, { message: "Please fill out field" }),
  suburb: z.string().min(1, { message: "Please fill out field" }),
  city: z.string().min(1, { message: "Please fill out field" }),
  state: z.string().min(1, { message: "Please fill out field" }),
  postal_code: z.string().length(4, { message: "Postal code must be 4 digits long" }),
  apartment_number: z.string().optional(),
  monthly_rent: z.coerce.number().min(1, { message: "Please fill out field" }),
  bedroom_number: z.coerce.number().min(1, { message: "Please fill out field" }),
  bathroom_number: z.coerce.number().min(1, { message: "Please fill out field" }),
  space: z.coerce.number().min(1, { message: "Please fill out field" }),
  description: z.string().min(1, { message: "Please fill out field" }),
  property_feature_ids: z.array(z.string()),
  images: z.array(z.instanceof(File)).min(0, { message: "At least one image is required" }),
  available_dates: z.coerce.date(),
  inspection_times: z.array(
    z.object({
      start_time: z.coerce.date(),
      end_time: z.coerce.date(),
    })
  ).default([]),
  lease_term: z.string().min(1, { message: "Lease term is required" }),
  show_contact_boolean: z.boolean().optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
