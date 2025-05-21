"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming-shadcn/Form";
import { Input } from "../../theming-shadcn/Input";
import { Textarea } from "../../theming-shadcn/Textarea";
import { FormSchemaType } from "./FormSchema";
import { UseFormReturn } from "react-hook-form";
import { FormHeading } from "./FormHeading";
import { MultiSelect } from "../../theming-shadcn/Multiselect";

const frameworksList = [
  { value: "react", label: "React"},
  { value: "angular", label: "Angular"},
  { value: "vue", label: "Vue"},
  { value: "svelte", label: "Svelte"},
  { value: "ember", label: "Ember"},
];

export default function FormPropertyDetails({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);
  return (
    <div className="border border-(--divider-color) w-full p-7 rounded-md mb-3">
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

        {/* FEATURES */}
      <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Multi-Select Component</h1>
      <MultiSelect
        options={frameworksList}
        onValueChange={setSelectedFrameworks}
        defaultValue={selectedFrameworks}
        placeholder="Select frameworks"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
        <ul className="list-disc list-inside">
          {selectedFrameworks.map((framework) => (
            <li key={framework}>{framework}</li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}
