"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "../theming/components/shadcn/Form";
import FormBasicInformation from "./components/FormBasicInformation";
import FormPropertyDetails from "./components/FormPropertyDetails";
import FormPropertyImages from "./components/FormPropertyImages";
import FormListingOptions from "./components/FormListingOptions";
import { Button } from "../theming/components/shadcn/Button";
import { ArrowLeftIcon } from "lucide-react";
import { FormDefaultValue } from "./components/FormDefaultValues";
import { formSchema, FormSchemaType } from "./components/FormSchema";

export function PropertyForm(): React.JSX.Element {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: FormDefaultValue,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
  };

  const onClick = () => {
    console.log("Button pressed!");
  };

  return (
    <div className="mt-6 ml-10">
      <div className="flex flex-col items-start">
        <button
          onClick={onClick}
          className="flex items-center text-[#71717A] mb-2 gap-2 text-sm hover:underline"
        >
          <ArrowLeftIcon className="scale-75" />{" "}
          <span className="text-md">Back to Properties</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold mb-1">Property Listing</h1>
          <h3 className="text-sm text-[#71717A]">
            Create a new rental property listing for a landlord
          </h3>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormBasicInformation form={form} />
            <FormPropertyDetails form={form} />
            <FormPropertyImages form={form} />
            <FormListingOptions form={form} />

            <div className="flex justify-end">
              <Button variant="black" onClick={() => onSubmit}>
                Create Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
