"use client";
import React from "react";
import { z } from "zod";
import {
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
  SelectValue,
} from "../../theming/components/shadcn/Select";
import { Input } from "../../theming/components/shadcn/Input";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./FormSchema";
import { FormHeading } from "./FormHeading";

type FormSchemaType = z.infer<typeof formSchema>;

export default function FormBasicInformation({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  return (
    <div className="border border-(--divider-color) w-full p-7 rounded-md">
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a landlord" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                <SelectItem value="Dylan Hoang">Dylan Hoang</SelectItem>
                <SelectItem value="Marcus Bontempelli">
                  Marcus Bontempelli
                </SelectItem>
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
          <FormItem className="py-2">
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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" type="" {...field} />
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
                  <Input placeholder="3000" type="" {...field} />
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
                  <Input placeholder="Apt 4B" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="monthly_rent"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Monthly Rent</FormLabel>
            <FormControl>
              <Input placeholder="2500" type="number" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bond"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Bond / Security Deposit</FormLabel>
            <FormControl>
              <Input placeholder="2500" type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
