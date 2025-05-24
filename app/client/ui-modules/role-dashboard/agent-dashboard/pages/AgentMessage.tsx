import React from "react";
export function AgentMessage(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  return (
      <div className="min-h-screen">
        <div className="flex">
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">Agent Messages</h1>
          </div>
        </div>
      </div>
    );
}
