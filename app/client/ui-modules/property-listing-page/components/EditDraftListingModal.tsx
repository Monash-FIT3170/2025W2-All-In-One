import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormSchemaType,
  formSchema,
} from "../../property-form-agent/components/FormSchema";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "../../theming/components/ThemedButton";
import React, { useRef, useEffect } from "react";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { apiUpdatePropertyData } from "/app/client/library-modules/apis/property/property-api";
import { apiUpdatePropertyListingData } from "/app/client/library-modules/apis/property-listing/listing-api";
import { useAppDispatch } from "/app/client/store";
import { load, insertPropertyPriceAsync } from "../state/reducers/property-listing-slice";
import { PropertyFormMode } from "../../property-form-agent/enum/PropertyFormMode";
import { PropertyForm, PropertyFormRef } from "../../property-form-agent/components/PropertyForm";
import { PropertyUpdateData } from "/app/shared/api-models/property/PropertyUpdateData";
import { uploadFilesHandler, getImageUrlsFromUploadResults } from "/app/client/library-modules/apis/azure/blob-api";
import { BlobNamePrefix } from "/app/shared/azure/blob-models";
import { updatePropertyListingImages } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";
import { ImageType } from "../../property-form-agent/enum/ImageType";

interface EditDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  propertyForm: FormSchemaType;
  landlords: (Landlord & { firstName: string; lastName: string })[];
  features: { value: string; label: string }[];
  propertyId: string;
  existingImageUrls?: string[];
}

export default function EditDraftListingModal(
  props: EditDraftListingModalProps
) {
  const listingInfo = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: props.propertyForm,
  });
  const dispatch = useAppDispatch();
  const propertyFormRef = useRef<PropertyFormRef>(null);

  // Debug form state
  useEffect(() => {
    console.log("=== FORM VALIDATION DEBUG ===");
    console.log("Form errors:", listingInfo.formState.errors);
    console.log("Form is valid:", listingInfo.formState.isValid);
    console.log("Form values:", listingInfo.getValues());
    
    // Show specific validation failures
    const errors = listingInfo.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log("VALIDATION FAILURES:");
      Object.entries(errors).forEach(([field, error]) => {
        console.log(`- ${field}: ${error?.message || 'Unknown error'}`);
      });
      
      // Check for nested errors (like in arrays)
      if (errors.inspection_times) {
        console.log("Inspection times errors:", errors.inspection_times);
      }
    } else {
      console.log("SUCCESS: All validations passed!");
    }
    console.log("============================");
  }, [listingInfo.formState.errors, listingInfo.formState.isValid]);

  // Load existing images when modal opens
  useEffect(() => {
    if (props.isOpen && props.existingImageUrls && props.existingImageUrls.length > 0) {
      console.log("Loading existing images in EditDraftListingModal:", props.existingImageUrls);
      propertyFormRef.current?.loadExistingImages(props.existingImageUrls);
    }
    
    // Trigger validation when modal opens
    if (props.isOpen) {
      console.log("Modal opened, triggering form validation...");
      listingInfo.trigger(); // This will trigger validation for all fields
    }
  }, [props.isOpen, props.existingImageUrls, listingInfo]);

  const handleSaveChanges = async (values: FormSchemaType) => {
    console.log("handleSaveChanges called with values:", values);
    // Update property details
    console.log("Updating listing details:", values);

    const updatedProperty: PropertyUpdateData = {
      propertyId: props.propertyId,
      streetnumber: values.address_number,
      streetname: values.address,
      suburb: values.suburb,
      province: values.state,
      postcode: values.postal_code,
      apartment_number: values.apartment_number,
      description: values.description,
      summaryDescription: values.summary_description,
      bathrooms: values.bathroom_number,
      bedrooms: values.bedroom_number,
      parking: values.parking_spaces,
      features: values.property_feature_ids,
      type: values.property_type,
      area: values.space,
      landlordId: values.landlord,
    };

    // Update property details
    const prop = await apiUpdatePropertyData(updatedProperty);

    // Update property price (insert new price record)
    console.log("Updating property price to:", values.monthly_rent);
    await dispatch(insertPropertyPriceAsync({ 
      propertyId: props.propertyId, 
      price: values.monthly_rent 
    })).unwrap();
    console.log("Property price updated successfully");

    // Update listing-specific data (lease term and inspection times)
    const listingUpdateData = {
      propertyId: props.propertyId,
      leaseTerm: values.lease_term,
      inspectionTimes: values.inspection_times.map(inspection => ({
        start_time: new Date(inspection.start_time),
        end_time: new Date(inspection.end_time),
      })),
    };

    await apiUpdatePropertyListingData(listingUpdateData);

    // Handle image updates - get both existing and new images in the correct order
    const combinedImageData = propertyFormRef.current?.getCombinedImages();
    if (combinedImageData && (combinedImageData.existingImages.length > 0 || combinedImageData.newImages.length > 0)) {
      console.log("Processing combined images:", combinedImageData);
      
      // Upload new files and get their URLs (uploadFilesHandler handles dev vs prod)
      let newFileUrls: string[] = [];
      
      if (combinedImageData.newImages.length > 0) {
        try {
          const uploadResults = await uploadFilesHandler(combinedImageData.newImages, BlobNamePrefix.PROPERTY);
          newFileUrls = getImageUrlsFromUploadResults(uploadResults);
        } catch (error) {
          console.error("Failed to upload new images:", error);
          // Continue without new images if upload fails
        }
      }

      // Create a mapping from File objects to their uploaded URLs
      const fileToUrlMap = new Map<File, string>();
      combinedImageData.newImages.forEach((file, index) => {
        if (newFileUrls[index]) {
          fileToUrlMap.set(file, newFileUrls[index]);
        }
      });

      // Preserve the user's ordering by converting the ordered array
      const finalImageUrls: string[] = [];
      combinedImageData.imageOrder.forEach(orderItem => {
        if (orderItem.type === ImageType.EXISTING) {
          // Existing URL - keep as is
          const existingUrl = combinedImageData.existingImages[orderItem.index];
          if (existingUrl) {
            finalImageUrls.push(existingUrl);
          }
        } else {
          // File object - use its uploaded URL if available
          const file = combinedImageData.newImages[orderItem.index];
          const uploadedUrl = file ? fileToUrlMap.get(file) : undefined;
          if (uploadedUrl) {
            finalImageUrls.push(uploadedUrl);
          }
        }
      });

      // Update the listing with the ordered image URLs
      try {
        await updatePropertyListingImages(props.propertyId, finalImageUrls);
        console.log("Updated listing images successfully:", finalImageUrls);
      } catch (error) {
        console.error("Failed to update listing images:", error);
      }
    }

    // Refresh the page
    dispatch(load(props.propertyId));

    // Close modal
    console.log("Finished updating listing, closing modal");
    props.toggle();
  };

  const handleFormSubmit = (values: FormSchemaType) => {
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Form submit triggered, calling handleSaveChanges");
    console.log("Submitted values:", values);
    console.log("Form errors at submit:", listingInfo.formState.errors);
    console.log("Form is valid at submit:", listingInfo.formState.isValid);
    console.log("========================");
    handleSaveChanges(values);
  };

  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-[50%] flex-col overflow-hidden rounded-xl bg-white p-4"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="w-full max-w-3xl mx-auto">
                <PropertyForm
                  ref={propertyFormRef}
                  onSubmit={handleFormSubmit}
                  form={listingInfo}
                  landlords={props.landlords}
                  features={props.features || []}
                  mode={PropertyFormMode.EDIT}
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-300 bg-white pt-4 pb-4">
              <ThemedButton
                variant={ThemedButtonVariant.SECONDARY}
                onClick={() => {
                  listingInfo.reset();
                  props.toggle();
                }}
              >
                Cancel
              </ThemedButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
