"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming-shadcn/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../theming-shadcn/Select";
import { Input } from "../../theming-shadcn/Input";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "./FormSchema";
import { FormHeading } from "./FormHeading";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

export default function FormBasicInformation({
  form,
  landlords,
}: {
  form: UseFormReturn<FormSchemaType>;
  landlords: (Landlord & { firstName: string; lastName: string })[];
}) {
  return (
    <div className="border border-(--divider-color) w-full p-7 rounded-md mb-3">
      <FormHeading
        title="Basic Information"
        subtitle="Enter the basic details of the property"
      ></FormHeading>
      <FormField
        control={form.control}
        name="landlord"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Landlord</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a landlord" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                side="bottom"
                position="popper"
                className="z-[9999] bg-white"
              >
                {landlords.map((landlord) => (
                  <SelectItem
                    key={landlord.landlordId}
                    value={landlord.landlordId}
                  >
                    {landlord.firstName} {landlord.lastName}
                  </SelectItem>
                ))}
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
          <FormItem className="py-2">
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                side="bottom"
                position="popper"
                className="z-[9999] bg-white"
              >
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
          <FormField
            control={form.control}
            name="address_number"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Street Number</FormLabel>
                <FormControl>
                  <Input placeholder="123" type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-9">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Main St" type="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Suburb</FormLabel>
                <FormControl>
                  <Input placeholder="Clayton" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Melbourne" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="VIC" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="3000" min={0} type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="apartment_number"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Unit/Apt # (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apt 4B" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-12">
          <FormField
            control={form.control}
            name="monthly_rent"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Monthly Rent</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
