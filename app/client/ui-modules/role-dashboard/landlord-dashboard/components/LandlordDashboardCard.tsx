import React, { useState, useEffect } from "react";
import { CardWidget } from "../../../common/CardWidget";
import { Progress } from "../../components/ProgressBar";

interface LandlordDashBoardProps {
  dashboardData: {
    propertyCount: number;
    statusCounts: { occupied: number; vacant: number };
    income: { weekly: number; monthly: number };
    occupancyRate: number;
    averageRent: { occupiedCount: number; rent: number };
  };
}

export function LandlordDashboardCards({
  dashboardData,
}: LandlordDashBoardProps) {
  const { propertyCount, statusCounts, income, occupancyRate, averageRent } =
    dashboardData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
        subtitle={`${statusCounts.occupied} Occupied, ${statusCounts.vacant} Vacant`}
      />
      <CardWidget
        title="Total Income"
        value={`$${income.weekly}/week`}
        subtitle={`$${income.monthly}/month`}
      />
      <CardWidget title="Occupancy Rate" value={`${occupancyRate}%`}>
        {occupancyRate !== null && (
          <Progress value={occupancyRate} className="mt-2" />
        )}
      </CardWidget>
      <CardWidget
        title="Average Rent"
        value={`$${averageRent.rent}/month`}
        subtitle={
          averageRent.occupiedCount === 0
            ? "No owned properties currently occupied..."
            : `Across ${averageRent.occupiedCount} occupied propert${
                averageRent.occupiedCount === 1 ? "y" : "ies"
              }`
        }
      />
    </div>
  );
}
