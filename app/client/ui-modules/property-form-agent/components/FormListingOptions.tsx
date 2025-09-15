"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming-shadcn/Form";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../theming-shadcn/Popover";
import { Calendar } from "../../theming-shadcn/Calendar";
import { Input } from "../../theming-shadcn/Input";
import { Calendar as CalendarIcon, X, ArrowRight } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../theming-shadcn/RadioGroup";
import { Button } from "../../theming-shadcn/Button";
import { FormSchemaType } from "./FormSchema";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormHeading } from "./FormHeading";
import { DateTime } from "../../theming-shadcn/Datetime";
export default function FormListingOptions({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inspection_times",
  });

  return (
    <div className="border border-(--divider-color) w-full p-7 rounded-md mb-3">
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
                    className={`w-[240px] pl-3 text-left font-normal border-[--divider-color] ${!field.value ? "text-muted-foreground" : ""}`}
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
                className="w-auto p-0 border-(--divider-color) bg-white"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
<FormItem className="py-2">
  <div className="mb-3 flex items-center justify-between">
    <FormLabel className="text-base">Inspection Times</FormLabel>
    <Button
      type="button"
      variant="outline"
      onClick={() => append({ start_time: new Date(), end_time: new Date() })}
    >
      Add inspection
    </Button>
  </div>

  <div className="rounded-md border border-(--divider-color) bg-white p-4">
    {fields.length === 0 ? (
      <div className="text-sm text-muted-foreground">
        No inspections added yet.
      </div>
    ) : (
      <div className="space-y-3">
        {fields.map((f, index) => (
  <div key={f.id} className="rounded-md border border-(--divider-color) bg-white p-3">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium">Inspection {index + 1}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remove inspection"
        onClick={() => remove(index)}
      >
        <X />
      </Button>
    </div>

    <div className="flex items-end gap-3">
      <FormField
        control={form.control}
        name={`inspection_times.${index}.start_time` as const}
        render={({ field }) => (
          <FormItem className="basis-0 grow">
            <FormControl>
              <DateTime value={field.value} onChange={field.onChange} dateLabel="Start Date" timeLabel="Start Time" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`inspection_times.${index}.end_time` as const}
        render={({ field }) => (
          <FormItem className="basis-0 grow">
            <FormControl>
              <DateTime value={field.value} onChange={field.onChange} dateLabel="End Date" timeLabel="End Time" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
))}
      </div>
    )}
  </div>
</FormItem>


      <FormField
        control={form.control}
        name="lease_term"
        render={({ field }) => (
          <FormItem className="space-y-3 py-2">
            <FormLabel>Lease Term</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col space-y-2"
              >
                {[
                  ["12 Months", "12_months"],
                  ["6 Months", "6_months"],
                  ["Month-to-month", "month_to_month"],
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
    </div>
  );
}