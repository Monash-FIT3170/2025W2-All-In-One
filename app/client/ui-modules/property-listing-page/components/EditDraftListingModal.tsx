import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSchemaType, formSchema } from "../../property-form-agent/components/FormSchema";
import { formDefaultValues, PropertyForm } from "../../property-form-agent/components/PropertyForm";
import { ThemedButton, ThemedButtonVariant } from "../../theming/components/ThemedButton";
import React from "react";

interface EditDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  propertyForm: FormSchemaType;
}

export default function EditDraftListingModal(props: EditDraftListingModalProps) {
  const listingInfo = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: props.propertyForm,
  });

  const handleSaveChanges = async (values: FormSchemaType) => {
    try {
      console.log("Saved successfully", values);
      console.log("Closing modal")
      props.toggle();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-[50%] flex-col overflow-hidden rounded-xl bg-white p-4">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="w-full max-w-3xl mx-auto">
                <PropertyForm onSubmit={handleSaveChanges} form={listingInfo} mode={"edit"}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
