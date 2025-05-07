import { ThemedButton, ThemedButtonVariant } from "../../theming/components/ThemedButton";
import React from "react";

interface EditDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

export default function EditDraftListingModal(props: EditDraftListingModalProps) {
  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-[70%] flex-col overflow-hidden rounded-xl bg-white p-4">
            <div className="flex-1 overflow-y-auto pr-4">
              {props.children}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-300 bg-white pt-4 pb-4">
              <ThemedButton variant={ThemedButtonVariant.SECONDARY} onClick={props.toggle}>
                Cancel
              </ThemedButton>
              <ThemedButton variant={ThemedButtonVariant.TERTIARY} onClick={props.toggle}>
                Save Changes
              </ThemedButton>
              <ThemedButton variant={ThemedButtonVariant.PRIMARY} onClick={props.toggle}>
                Publish listing
              </ThemedButton>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
