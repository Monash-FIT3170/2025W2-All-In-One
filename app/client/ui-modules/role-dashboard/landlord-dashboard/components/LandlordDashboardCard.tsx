import React, { useState, useEffect } from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { useAppSelector } from "/app/client/store";
import { selectLandlordDashboard } from "../state/landlord-dashboard-slice";

export function LandlordDashboardCards() {
  const dashboardData = useAppSelector(selectLandlordDashboard);

  const propertyCount = dashboardData?.propertyCount ?? 0;
  const statusCounts = dashboardData?.statusCounts ?? null;
  const income = dashboardData?.income ?? null;
  const occupancyRate = dashboardData?.occupancyRate ?? null;
  const averageRent = dashboardData?.averageRent ?? null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
        subtitle={
          statusCounts
            ? `${statusCounts.occupied} Occupied, ${statusCounts.vacant} Vacant`
            : "Loading..."
        }
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
