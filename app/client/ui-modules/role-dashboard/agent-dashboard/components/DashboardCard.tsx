import React from 'react';
import { Progress } from '../../components/ProgressBar';
import { CardWidget } from '../../components/CardWidget';

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CardWidget
        title="Total Properties"
        value="12"
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