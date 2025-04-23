"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../theming/components/shadcn/Form";
import { Input } from "../../theming/components/shadcn/Input";
import { Textarea } from "../../theming/components/shadcn/Textarea";

const formSchema = z.object({
  bedroom_number: z.number().min(0),
  bathroom_number: z.number().min(0),
  space: z.number().min(0),
  description: z.string(),
  amenities: z.string()
});

export default function PropertyDetails() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  });

  return (
    <div className="border border-[#0c0c2d]">
            <h1 className="text-xl mt-5 mb-2 space-y-8 max-w-3xl mx-auto font-semibold">Property Details</h1>
            <h3 className="text-sm  max-w-3xl mx-auto text-[#71717A]">Enter specific details about the property</h3>
    <Form {...form}>
      <form className="space-y-4 max-w-3xl mx-auto py-10">
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-4">
            
        <FormField
          control={form.control}
          name="bedroom_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input 
                placeholder="2"
                
                type="number"
                {...field} />
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
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input 
                placeholder="2"
                
                type="number"
                {...field} />
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
            <FormItem>
              <FormLabel>Space (m²)</FormLabel>
              <FormControl>
                <Input 
                placeholder="1200"
                
                type="number"
                {...field} />
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
            <FormItem>
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
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter property amenities (e.g. Air Conditioning, Heating, Washer/Dryer, etc.)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[#71717A]">Separate amenities with commas or new lines</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
    </div>
  )
}