import React from "react";
import EditDraftListingModal from "./components/EditDraftListingModal";

export function AgentProperties() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <button onClick={toggleModal}>Click this to edit a property listing draft</button>
      <EditDraftListingModal isOpen={isModalOpen} toggle={toggleModal}>
        <div>
          <h1>A beach house</h1>
          <p>A nice beach house.</p>
          <div style={{ height: "1000px" }}/>
        </div>
      </EditDraftListingModal>
    </div>
  );
}