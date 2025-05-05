import { ThemedButton, ThemedButtonVariant } from "../../theming/components/ThemedButton";
import React from "react";
import Modal from "./Modal";

interface EditDraftListingModalProps {
  toggle: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

export default function EditDraftListingModal(props: EditDraftListingModalProps) {
  const modalFooter = (
    <>
      <ThemedButton variant={ThemedButtonVariant.SECONDARY} onClick={props.toggle}>
        Cancel
      </ThemedButton>
      <ThemedButton variant={ThemedButtonVariant.TERTIARY} onClick={props.toggle}>
        Save Changes
      </ThemedButton>
      <ThemedButton variant={ThemedButtonVariant.PRIMARY} onClick={props.toggle}>
        Publish listing
      </ThemedButton>
    </>
  )

  return (
    <>
      <Modal isOpen={props.isOpen} toggle={props.toggle} footer={modalFooter}>
        {props.children}
      </Modal>
    </>
  );

}
