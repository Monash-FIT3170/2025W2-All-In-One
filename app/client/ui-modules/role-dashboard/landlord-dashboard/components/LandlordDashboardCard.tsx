import React, { useState, useEffect } from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { useAppSelector } from "/app/client/store";
import { landlordPropertyRepository } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

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
    if (currentUser && "landlordId" in currentUser && currentUser.landlordId) {
      const fetchData = async () => {
        try {
          const [count, statusCounts, income, occupancyRate, averageRent] =
            await Promise.all([
              landlordPropertyRepository.getLandlordPropertyCount(
                currentUser.landlordId
              ),
              landlordPropertyRepository.getLandlordStatusCounts(
                currentUser.landlordId
              ),
              landlordPropertyRepository.getLandlordIncome(
                currentUser.landlordId
              ),
              landlordPropertyRepository.getLandlordOccupancyRate(
                currentUser.landlordId
              ),
              landlordPropertyRepository.getLandlordAverageRent(
                currentUser.landlordId
              ),
            ]);

          setPropertyCount(count);
          setStatusCounts(statusCounts);
          setIncome(income);
          setOccupancyRate(occupancyRate);
          setAverageRent(averageRent);
        } catch (error) {
          console.error("Error fetching landlord dashboard data:", error);
        }
      };
      fetchData();
    }
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
