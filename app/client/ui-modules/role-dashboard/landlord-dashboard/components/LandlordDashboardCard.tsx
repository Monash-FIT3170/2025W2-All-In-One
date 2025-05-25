import React, { useState, useEffect } from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { useAppSelector } from "/app/client/store";

export function LandlordDashboardCards() {
  const [propertyCount, setPropertyCount] = useState<number>(0);
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
  }, [currentUser]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
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
