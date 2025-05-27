"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { formSchema, FormSchemaType } from "./components/FormSchema";
import { formDefaultValues, PropertyForm } from "./components/PropertyForm";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { useAppDispatch } from "../../store";
import { PropertyFormPageUiState } from "./state/PropertyFormPageUIState";
import { load, selectPropertyFormUiState } from "./state/reducers/property-form-slice";
import { useSelector } from "react-redux";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { getPropertyStatusId, insertProperty} from "../../library-modules/domain-models/property/repositories/property-repository";
import { uploadFilesHandler } from "../../library-modules/apis/azure/blob-api";
import { BlobNamePrefix, UploadResults } from "/app/shared/azure/blob-models";
import { apiInsertPropertyListing } from "../../library-modules/apis/property-listing/listing-api";
import { useNavigate } from "react-router";
import { apiPropertyInsertPrice } from "../../library-modules/apis/property-price/price-api";
import { NavigationPath } from "../../navigation";import { PropertyFormMode } from "./enum/PropertyFormMode";

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
  
    const insertDoc: PropertyInsertData = {
      streetnumber: values.address_number,
      streetname: values.address,
      suburb: values.city,
      province: values.state,
      postcode: values.postal_code,
      property_status_id: await getPropertyStatusId(PropertyStatus.VACANT),
      description: values.description,
      summary_description: values.description.slice(0, 60),
      bathrooms: values.bathroom_number,
      bedrooms: values.bedroom_number,
      parking: 0, // not collected yet
      property_feature_ids: values.property_feature_ids,
      type: values.property_type,
      area: values.space,
      agent_id: "", // not collected yet
      landlord_id: values.landlord,
      tenant_id: "", // not collected yet
    };
    console.log("Insert Document:", insertDoc); 
    const propertyId = await insertProperty(insertDoc);
    console.log("Property inserted with ID:", propertyId);

    await apiPropertyInsertPrice(propertyId, 1500);
    console.log("Property price inserted for ID:", propertyId);

    const uploadReturnValues: UploadResults = await uploadFilesHandler(values.images,BlobNamePrefix.PROPERTY)

    if (uploadReturnValues.failed.length > 0) {
      console.error("Failed to upload some images:", uploadReturnValues.failed);
      throw new Meteor.Error(`Image upload failed. Please try again.`);
      return;
    } 

    const imageUrls: string[] = uploadReturnValues.success.map((uploadResult) => {return uploadResult.url})
    await apiInsertPropertyListing(propertyId,imageUrls)

    navigator(`${NavigationPath.PropertyListing}?propertyId=${propertyId}`)
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
          <PropertyForm onSubmit={handleSubmit} form={form} landlords={state.landlords} features={state.featureOptions} mode={PropertyFormMode.CREATE} />
      </div>
    </div>
  );
}