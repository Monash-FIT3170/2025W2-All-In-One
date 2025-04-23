"use client"
import React from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


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
</div>
  )
}