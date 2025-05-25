import React, { useState, useEffect } from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { useAppSelector } from "/app/client/store";
import { current } from "@reduxjs/toolkit";

export function LandlordDashboardCards() {
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<{
    occupied: number;
    vacant: number;
  } | null>(null);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);

  useEffect(() => {
    const getPropertyCount = async () => {
      if (
        currentUser &&
        "landlordId" in currentUser &&
        currentUser.landlordId
      ) {
        try {
          const count = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_LANDLORD_GET_COUNT,
            currentUser.landlordId
          );
          setPropertyCount(count);
        } catch (error) {
          console.error("Error fetching property count for landlord:", error);
        }
      }
    };

    getPropertyCount();

    const getStatusCounts = async () => {
      if (
        currentUser &&
        "landlordId" in currentUser &&
        currentUser.landlordId
      ) {
        try {
          const result = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_LANDLORD_GET_STATUS_COUNTS,
            currentUser.landlordId
          );
          setStatusCounts(result);
        } catch (error) {
          console.error("Error fetching status counts for landlord:", error);
        }
      }
    };

    getStatusCounts();
  }, [currentUser]);

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
