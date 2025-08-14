import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { useAppSelector } from "../../../../store";
import {
  selectMessagesCount,
  selectLeaseStatusKind,
  selectLeaseMonthsRemaining,
  LeaseStatusKind,
} from "../state/tenant-dashboard-slice";
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from "date-fns";

interface DashboardCardsProps {
  rentAmount?: number;
  tasks?: Task[];
}

function DashboardCards({ rentAmount, tasks = [] }: DashboardCardsProps) {
  // Get state values from Redux
  const messagesCount = useAppSelector(selectMessagesCount);
  const leaseStatusKind = useAppSelector(selectLeaseStatusKind);
  const leaseMonthsRemaining = useAppSelector(selectLeaseMonthsRemaining);

  // Calculate pending tasks (not completed)
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);
  const pendingTasksCount = pendingTasks.length;

  // Calculate tasks due this week
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });

  const tasksDueThisWeek = pendingTasks.filter(t => {
    const due = parseISO(t.dueDate); // YYYY-MM-DD
    return isWithinInterval(due, { start, end });
  }).length;

  // Determine lease display values based on enum
  const leaseValue = leaseStatusKind === LeaseStatusKind.NotAvailable 
    ? "N/A" 
    : `${leaseMonthsRemaining} months`;
  
  const leaseSubtitle = leaseStatusKind === LeaseStatusKind.NotAvailable
    ? "Not available yet"
    : "Remaining on current lease";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <CardWidget
        title="Next Rent Payment"
        value={rentAmount ? `$${rentAmount.toLocaleString()}` : "N/A"}
        subtitle="Due in 5 days (April 1)"
      />

      <CardWidget
        title="Lease Status"
        value={leaseValue}
        subtitle={leaseSubtitle}
      />

      <CardWidget
        title="Pending Tasks"
        value={pendingTasksCount === 0 ? "0" : `${pendingTasksCount} Active`}
        subtitle={
          pendingTasksCount === 0
            ? "No Pending tasks"
            : tasksDueThisWeek > 0
              ? `${tasksDueThisWeek} due this week`
              : "No tasks due this week"
        }
      />

      <CardWidget
        title="Messages"
        value={messagesCount.toString()}
        subtitle={
          messagesCount === 0 ? "No new messages" : `${messagesCount} unread`
        }
      />
    </div>
  );
}

export default DashboardCards;
