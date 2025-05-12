import * as z from "zod";

export const formSchema = z.object({
  landlord: z.string().min(1, { message: "Please assign a landlord" }),
  property_type: z.string().min(1, { message: "Please select a property type" }),
  address: z.string().min(1, { message: "Please fill out field" }),
  city: z.string().min(1, { message: "Please fill out field" }),
  state: z.string().min(1, { message: "Please fill out field" }),
  postal_code: z.string().length(4, { message: "Postal code must be 4 digits long" }),
  apartment_number: z.string().optional(),
  monthly_rent: z.coerce.number().min(1, { message: "Monthly rent must be greater than 0" }),
  bond: z.coerce.number().min(1, { message: "Please fill out field" }),
  bedroom_number: z.coerce.number().min(1, { message: "Please fill out field" }),
  bathroom_number: z.coerce.number().min(1, { message: "Please fill out field" }),
  space: z.coerce.number().min(1, { message: "Please fill out field" }),
  description: z.string().min(1, { message: "Please fill out field" }),
  amenities: z.string().min(1, { message: "Please fill out field" }),
  images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" }),
  available_dates: z.coerce.date(),
  lease_term: z.string().min(1, { message: "Lease term is required" }),
  show_contact_boolean: z.boolean().optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
