import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormSchemaType,
  formSchema,
} from "../../property-form-agent/components/FormSchema";
import { PropertyForm } from "../../property-form-agent/components/PropertyForm";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "../../theming/components/ThemedButton";
import React from "react";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getPropertyStatusId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { apiUpdateProperty } from "/app/client/library-modules/apis/property/property-api";

interface EditDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  propertyForm: FormSchemaType;
  landlords: Landlord[];
  propertyId: string;
}

export default function EditDraftListingModal(
  props: EditDraftListingModalProps
) {
  const listingInfo = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: props.propertyForm,
  });

  const handleSaveChanges = async (values: FormSchemaType) => {
    // Update property details
    console.log("Updating listing details:", values);

    const addressParts = values.address.trim().split(" ");

    const updatedProperty = {
      propertyId: props.propertyId,
      streetnumber: addressParts[0],
      streetname: addressParts.slice(1).join(" "),
      suburb: "Clayton",
      province: values.state,
      postcode: values.postal_code,
      propertyStatus: PropertyStatus.VACANT,
      description: values.description,
      summaryDescription: "I updated this summary description.",
      bathrooms: values.bathroom_number,
      bedrooms: values.bedroom_number,
      parking: 100,
      features: [], // TODO: Replace with actual value if available
      type: values.property_type,
      area: values.space,
      pricePerMonth: 0, // TODO: Replace with actual value if available
      agentId: "", // TODO: Replace with actual value if available
      landlordId: values.landlord,
      tenantId: "", // TODO: Replace with actual value if available
    };

    const prop = await apiUpdateProperty(updatedProperty);

    // Refresh the page
    window.location.reload();

    // Close modal
    console.log("Finished updating listing, closing modal");
    props.toggle();
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
                  onSubmit={handleSaveChanges}
                  form={listingInfo}
                  landlords={props.landlords}
                  mode={"edit"}
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
