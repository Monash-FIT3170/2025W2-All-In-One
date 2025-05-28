import React, { useEffect } from 'react';
import { Progress } from '../../components/ProgressBar';
import { CardWidget } from '../../components/CardWidget';
import { useAppSelector, useAppDispatch } from '/app/client/store';
import {
  fetchPropertyCount,
  fetchPropertiesAndMetrics,
  selectAgentDashboard
} from '../state/agent-dashboard-slice';

export function DashboardCards() {
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const {propertyCount, monthlyRevenue, occupancyRate, isLoading, error} = useAppSelector(selectAgentDashboard);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
      dispatch(fetchPropertyCount(currentUser.agentId));
      dispatch(fetchPropertiesAndMetrics(currentUser.agentId));
    }
  }, [currentUser, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value={propertyCount.toString()}
        subtitle="+2 from last month"
      />
      <CardWidget
        title="Occupancy Rate"
        value={`${occupancyRate.toFixed(2)}%`}
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