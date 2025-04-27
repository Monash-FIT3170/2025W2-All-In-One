"use client";
import React from "react";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming/components/shadcn/Form";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../theming/components/shadcn/Popover";
import { Calendar } from "../../theming/components/shadcn/Calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../theming/components/shadcn/RadioGroup";
import { Switch } from "../../theming/components/shadcn/Switch";
import { Button } from "../../theming/components/shadcn/Button";
import { cn } from "/app/client/lib/utils";
import { formSchema } from "../PropertyForm";
import { UseFormReturn } from "react-hook-form";
import { FormHeading } from "./FormHeading";

type FormSchemaType = z.infer<typeof formSchema>;

export default function FormListingOptions({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {

  return (
    <div className="border border-[#E4E4E7] w-full p-7 rounded-md">
      <FormHeading
        title="Listing Options"
        subtitle="Configure additional listing settings"
      />
      <FormField
        control={form.control}
        name="available_dates"
        render={({ field }) => (
          <FormItem className="flex flex-col py-2">
            <FormLabel>Available from</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal border-[#E4E4E7]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-[#E4E4E7] bg-white"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lease_term"
        render={({ field }) => (
          <FormItem className="space-y-3 py-2">
            <FormLabel>Lease Term</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-col space-y-2"
              >
                {[
                  ["12 Months", "12_months"],
                  ["6 Months", "6_months"],
                  ["Month-to-month", "month_to_month"],
                  ["Custom", "custom"],
                ].map((option, index) => (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={index}
                  >
                    <FormControl>
                      <RadioGroupItem value={option[1]} />
                    </FormControl>
                    <FormLabel className="font-normal">{option[0]}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <h4 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pb-2 py-2">
        Contact Information
      </h4>
      <FormField
        control={form.control}
        name="show_contact_boolean"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-items-start space-x-5">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
                className="flex justify-start"
              />
            </FormControl>
            <FormLabel className="font-light pb-2">
              Show my contact information
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}
