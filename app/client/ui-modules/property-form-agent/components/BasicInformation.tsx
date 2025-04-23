"use client"
import React from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming/components/shadcn/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../theming/components/shadcn/Select";
import { Input}  from "../../theming/components/shadcn/Input";


const basicInformationSchema = z.object({
  landlord: z.string(),
  property_type: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  apartment_number: z.string().optional(),
  monthly_rent: z.string(),
  bond: z.string()
});

export default function BasicInformation() {

const form = useForm < z.infer < typeof basicInformationSchema >> ({
  resolver: zodResolver(basicInformationSchema),

})

  return (
    <div>
<Form {...form}>
<form className="space-y-8 max-w-3xl mx-auto py-10">
  
  <FormField
    control={form.control}
    name="landlord"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Select Landlord</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a landlord" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white">
            <SelectItem value="Dylan Hoang">Dylan Hoang</SelectItem>
            <SelectItem value="Marcus Bontempelli">Marcus Bontempelli</SelectItem>
            <SelectItem value="Nick Daicos">Nick Daicos</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />

<FormField
control={form.control}
name="property_type"
render={({ field }) => (
  <FormItem>
    <FormLabel>Property Type</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select property type" />
        </SelectTrigger>
      </FormControl>
      <SelectContent className="bg-white">
        <SelectItem value="house">House</SelectItem>
        <SelectItem value="apartment">Apartment</SelectItem>
      </SelectContent>
    </Select>
      
    <FormMessage />
  </FormItem>
)}
/>
</form>
</Form>
</div>
  )
}