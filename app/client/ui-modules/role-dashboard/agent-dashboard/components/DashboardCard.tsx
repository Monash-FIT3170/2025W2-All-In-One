import React, { useEffect, useState } from 'react';
import { Progress } from '../../components/ProgressBar';
import { CardWidget } from '../../components/CardWidget';
import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { useAppSelector } from '/app/client/store';

export function DashboardCards() {
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
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
    getPropertyCount();
  }, [currentUser]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value= {propertyCount.toString()}
        subtitle="+2 from last month"
      />
      <CardWidget
        title="Occupancy Rate"
        value="85%"
      >
        <Progress value={85} className="mt-2" />
      </CardWidget>
      <CardWidget
        title="Pending Tasks"
        value="7"
        subtitle="5 due this week"
      />
      <CardWidget
        title="Monthly Revenue"
        value="$24,500"
        subtitle="+5% from last month"
      />
    </div>
  );
}