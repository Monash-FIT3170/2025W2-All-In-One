import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";

interface DashboardCardsProps {
  rentAmount?: number;
}

function DashboardCards({ rentAmount }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <CardWidget
        title="Next Rent Payment"
        value={rentAmount ? `$${rentAmount.toLocaleString()}` : "N/A"}
        subtitle="Due in 5 days (April 1)"
      />

      <CardWidget
        title="Lease Status"
        value="9 months"
        subtitle="Remaining on current lease"
      >
        <Progress value={85} className="mt-2" />
      </CardWidget>

      <CardWidget
        title="Maintenance"
        value="2 Active"
        subtitle="1 scheduled for tomorrow"
      />

      <CardWidget
        title="Messages"
        value="3 Unread"
        subtitle="Last message 2 hours ago"
      />
    </div>
  );
}

export default DashboardCards;
