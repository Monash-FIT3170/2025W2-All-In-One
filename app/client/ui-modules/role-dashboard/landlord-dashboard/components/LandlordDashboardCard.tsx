import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="My Properties"
        value="3"
        subtitle="2 Occupied, 1 Vacant"
      />
      <CardWidget
        title="Total Income"
        value="$1850/week"
        subtitle="$7400/month"
      />
      <CardWidget title="Occupancy Rate" value="67%">
        <Progress value={67} className="mt-2" />
      </CardWidget>
      <CardWidget
        title="Property Value"
        value="$2.4M"
        subtitle="+3.5% from last valuation"
      />
    </div>
  );
}
