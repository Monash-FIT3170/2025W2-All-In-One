"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { formSchema, FormSchemaType } from "./components/FormSchema";
import { formDefaultValues, PropertyForm } from "./components/PropertyForm";
import { useAppDispatch } from "../../store";
import { PropertyFormPageUiState } from "./state/PropertyFormPageUIState";
import { load, selectPropertyFormUiState, submitForm } from "./state/reducers/property-form-slice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { NavigationPath } from "../../navigation";
import { PropertyFormMode } from "./enum/PropertyFormMode";
export function PropertyFormPage() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });
  const dispatch = useAppDispatch();
  const state: PropertyFormPageUiState = useSelector(
    selectPropertyFormUiState
  );
  const navigator = useNavigate();

  useEffect(() => {
    dispatch(load());
  }, []);

  const onClick = () => {
    console.log("Attempting to return to previous route.");
  };

  const handleSubmit = async (values: FormSchemaType) => {
    dispatch(submitForm(values));
    navigator(`${NavigationPath.PropertyListing}?propertyId=${state.propertyId}`)
};
  
  return (
    <div className="mt-6 ml-10">
      <div className="flex flex-col items-start">
        <button
          onClick={onClick}
          className="flex items-center text-[#71717A] mb-2 gap-2 text-sm hover:underline"
        >
          <ArrowLeftIcon className="scale-75" />
          <span className="text-md">Back to Properties</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold mb-1">Property Listing</h1>
          <h3 className="text-sm text-[#71717A]">
            Create a new rental property listing for a landlord
          </h3>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 rounded-md space-y-10">
        <PropertyForm
          onSubmit={handleSubmit}
          form={form}
          landlords={state.landlords}
          features={state.featureOptions}
          mode={PropertyFormMode.CREATE}
        />
      </div>
    </div>
  );
}
