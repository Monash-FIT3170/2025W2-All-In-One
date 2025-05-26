"use client";
import React, { useState, useEffect } from "react";
import {
  FormControl,
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
import { getAllPropertyFeatures } from "/app/client/library-modules/domain-models/property/repositories/feature-respository";

export default function FormPropertyDetails({
  form,
  features,
}: {
  form: UseFormReturn<FormSchemaType>;
  features: { _id: string; name: string }[];
}) {
  const featureOptions = (features ?? []).map((feature) => ({
    value: feature._id,
    label: feature.name,
  }));
  

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

      <FormField
        control={form.control}
        name="property_feature_ids"
        render={() => (
          <FormItem className="py-4 max-w-xl">
            <FormLabel>Property Features</FormLabel>
            <FormControl>
              <MultiSelect
                options={featureOptions}
                onValueChange={(values) =>
                  form.setValue("property_feature_ids", values)
                }
                defaultValue={form.getValues("property_feature_ids") || []}
                placeholder="Select features"
                animation={2}
                maxCount={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
