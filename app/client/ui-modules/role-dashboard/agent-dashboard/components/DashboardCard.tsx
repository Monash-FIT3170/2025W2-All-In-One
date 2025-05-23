import React, { useState, useEffect } from 'react';
import { Progress } from '../../components/ProgressBar';
import { CardWidget } from '../../components/CardWidget';
import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { useAppSelector } from '/app/client/store';
import { ApiAgent } from '/app/shared/api-models/user/api-roles/ApiAgent';
import { Role } from '/app/shared/user-role-identifier';
import { ApiProperty } from '/app/shared/api-models/property/ApiProperty';
import { set } from 'date-fns';

export function DashboardCards() {
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const [occupancyRate, setOccupancyRate] = useState<number>(0);
  useEffect(() => {
    const getPropertyCount = async () => {
      if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
        try {
          const count = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_COUNT, currentUser.agentId);
          setPropertyCount(count);
        } catch (error) {
          console.error('Error fetching property count:', error);
        }
      }
    };

    const getMonthlyRevenue = async () => {
      if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
        try {
          const properties = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_LIST, currentUser.agentId) as ApiProperty[];
          const occupiedProperties = properties.filter(property => property.propertyStatus === "Occupied");
          const totalRevenue = occupiedProperties.reduce((sum, property) => sum + property.pricePerMonth, 0);
          setMonthlyRevenue(totalRevenue);


          // Calculate occupancy rate
          const totalProperties = properties.length;
          const occupancyRate = totalProperties > 0 ? (occupiedProperties.length / totalProperties) * 100 : 0;
          setOccupancyRate(occupancyRate);
        } catch (error) {
          console.error('Error fetching monthly revenue:', error);
        }
      }
    };

    getPropertyCount();
    getMonthlyRevenue();
  }, [currentUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
        subtitle="+2 from last month"
      />
      <CardWidget
        title="Occupancy Rate"
        value={`${occupancyRate}%`}
      >
        <Progress value={occupancyRate} className="mt-2" />
      </CardWidget>
      <CardWidget
        title="Pending Tasks"
        value="7"
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