import React, { useState, useEffect } from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { useAppSelector } from "/app/client/store";

export function LandlordDashboardCards() {
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<{
    occupied: number;
    vacant: number;
  } | null>(null);
  const [income, setIncome] = useState<{
    weekly: number;
    monthly: number;
  } | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number | null>(null);
  const [averageRent, setAverageRent] = useState<{
    occupiedCount: number;
    rent: number;
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

    const getIncome = async () => {
      if (
        currentUser &&
        "landlordId" in currentUser &&
        currentUser.landlordId
      ) {
        try {
          const result = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_LANDLORD_GET_TOTAL_INCOME,
            currentUser.landlordId
          );
          setIncome(result);
        } catch (error) {
          console.error(
            "Error fetching monthly/weekly income for landlord:",
            error
          );
        }
      }
    };

    getIncome();

    const getOccupancyRate = async () => {
      if (
        currentUser &&
        "landlordId" in currentUser &&
        currentUser.landlordId
      ) {
        try {
          const rate = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_LANDLORD_GET_OCCUPANCY_RATE,
            currentUser.landlordId
          );
          setOccupancyRate(rate);
        } catch (error) {
          console.error("Error fetching occupancy rate for landlord:", error);
        }
      }
    };

    getOccupancyRate();

    const getAverageRent = async () => {
      if (
        currentUser &&
        "landlordId" in currentUser &&
        currentUser.landlordId
      ) {
        try {
          const averageRent = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_LANDLORD_GET_AVERAGE_RENT,
            currentUser.landlordId
          );
          setAverageRent(averageRent);
        } catch (error) {
          console.error("Error fetching average rent for landlord:", error);
        }
      }
    };

    getAverageRent();
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
        subtitle={ averageRent === null ?  "Loading..." :  averageRent.occupiedCount === 0 ? "No owned properties currently occupied..." : `Across ${averageRent.occupiedCount} occupied propert${
                averageRent.occupiedCount === 1 ? "y" : "ies"
              }`
        }
      />
    </div>
  );
}
