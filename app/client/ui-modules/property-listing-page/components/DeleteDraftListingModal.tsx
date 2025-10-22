import React from "react";
import { ThemedButton, ThemedButtonVariant } from "../../theming/components/ThemedButton";

interface DeleteDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  propertyId: string;
  onClick: () => void;
}

export function DeleteDraftListingModal(props: DeleteDraftListingModalProps): React.JSX.Element {
  
  return (
       <>
  {props.isOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[40vh] w-[50%] flex-col overflow-hidden rounded-xl bg-white p-4"
      >
        <div className="flex-1 overflow-y-auto px-6 py-4 text-center">
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Delete Draft Listing</h2>
            <p className="mb-0">Are you sure you want to delete this draft listing? This action cannot be undone.</p>         
          </div>
        </div>
        <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-300 bg-white pt-4 pb-4">
          <ThemedButton
            variant={ThemedButtonVariant.SECONDARY}
            onClick={() => {
              props.toggle();
            }}
          >
            Cancel
          </ThemedButton>
          <ThemedButton
              variant={ThemedButtonVariant.DANGER}
              onClick={() => {
                props.onClick();
                props.toggle();
              }}
            >
              Delete
            </ThemedButton>
        </div>
      </div>
    </div>
  )}
</>
  )
}