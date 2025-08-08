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
        value={income ? `$${income.weekly}/week` : "Loading..."}
        subtitle={income ? `$${income.monthly}/month` : "Loading..."}
      />
      <CardWidget
        title="Occupancy Rate"
        value={occupancyRate !== null ? `${occupancyRate}%` : "Loading..."}
      >
        {occupancyRate !== null && (
          <Progress value={occupancyRate} className="mt-2" />
        )}
      </CardWidget>
      <CardWidget
        title="Average Rent"
        value={
          averageRent !== null ? `$${averageRent.rent}/month` : "Loading..."
        }
        subtitle={
          averageRent === null
            ? "Loading..."
            : averageRent.occupiedCount === 0
            ? "No owned properties currently occupied..."
            : `Across ${averageRent.occupiedCount} occupied propert${
                averageRent.occupiedCount === 1 ? "y" : "ies"
              }`
        }
      />
    </div>
  );
}
