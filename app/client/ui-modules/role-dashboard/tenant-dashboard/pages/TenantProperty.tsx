import React from "react";

function TenantProperty() {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Tenant Property</h1>
        </div>
      </div>
    </div>
  );
}

export default TenantProperty;
