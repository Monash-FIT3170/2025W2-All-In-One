import React, { useEffect } from "react";
import { Progress } from "../../components/ProgressBar";
import { CardWidget } from "../../components/CardWidget";

interface AgentDashBoardProps {
  propertyCount: number;
  monthlyRevenue: number;
  occupancyRate: number;
  tasksCount: number;
}

export function AgentDashboardCards({
  propertyCount,
  monthlyRevenue,
  occupancyRate,
  tasksCount,
}: AgentDashBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
        subtitle="+2 from last month"
      />
      <CardWidget title="Occupancy Rate" value={`${occupancyRate.toFixed(2)}%`}>
        <Progress value={occupancyRate} className="mt-2" />
      </CardWidget>
      <CardWidget
        title="Pending Tasks"
        value={tasksCount.toString()}
        subtitle="1 due this week"
      />
      <CardWidget
        title="Monthly Revenue"
        value={`$${monthlyRevenue.toLocaleString()}`}
        subtitle="+5% from last month"
      />
    </div>
  );
}
