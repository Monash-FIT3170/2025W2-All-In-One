import { useState } from "react";
import { ThemedButton, ThemedButtonVariant } from "../../theming/components/ThemedButton";
import React from "react";
import Modal from "./Modal";

export default function EditDraftListingModal() {
  const [isOpen, setisOpen] = useState(false);

  const toggle = () => {
    setisOpen(!isOpen);
  };

  const modalFooter = (
    <>
      <ThemedButton variant={ThemedButtonVariant.SECONDARY} onClick={toggle}>
        Cancel
      </ThemedButton>
      <ThemedButton variant={ThemedButtonVariant.TERTIARY} onClick={toggle}>
        Save Changes
      </ThemedButton>
      <ThemedButton variant={ThemedButtonVariant.PRIMARY} onClick={toggle}>
        Publish listing
      </ThemedButton>
    </>
  )

  return (
    <>
      <ThemedButton variant={ThemedButtonVariant.PRIMARY} onClick={toggle}>
        Open this
      </ThemedButton>
      <Modal isOpen={isOpen} toggle={toggle} footer={modalFooter}>
        <div>
          <h1>A beach house</h1>
          <p>A nice beach house.</p>
          <div style={{ height: "1000px" }}/>
        </div>
      </Modal>
    </>
  );

}
