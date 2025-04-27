"use client";
import React from "react";
import * as z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming/components/shadcn/Form";
import { Input } from "../../theming/components/shadcn/Input";
import { Textarea } from "../../theming/components/shadcn/Textarea";
import { formSchema } from "../PropertyForm";
import { UseFormReturn } from "react-hook-form";
import { FormHeading } from "./FormHeading";

type FormSchemaType = z.infer<typeof formSchema>;

export default function FormPropertyDetails({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  return (
    <div className="border border-[#E4E4E7] w-full p-7 rounded-md">
      <FormHeading
        title="Property Details"
        subtitle="Enter specific details about the property"
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="bedroom_number"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input placeholder="2" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-4">
          <FormField
            control={form.control}
            name="bathroom_number"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input placeholder="2" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-4">
          <FormField
            control={form.control}
            name="space"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Space (m²)</FormLabel>
                <FormControl>
                  <Input placeholder="1200" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Property Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the property in detail..."
                className="resize-none"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Amenities</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter property amenities (e.g. Air Conditioning, Heating, Washer/Dryer, etc.)"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[#71717A]">
              Separate amenities with commas or new lines
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
