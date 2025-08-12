import React from "react";
import { CardWidget } from "../../components/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { useAppSelector } from "../../../../store";
import {
  selectMessagesCount,
  selectLeaseStatus,
} from "../state/tenant-dashboard-slice";

interface DashboardCardsProps {
  rentAmount?: number;
  tasks?: Task[];
}

function DashboardCards({ rentAmount, tasks = [] }: DashboardCardsProps) {
  // Get state values from Redux
  const messagesCount = useAppSelector(selectMessagesCount);
  const leaseStatus = useAppSelector(selectLeaseStatus);

  // Calculate pending tasks (not completed)
  const pendingTasks = tasks.filter(
    (task) => task.status !== TaskStatus.COMPLETED
  );
  const pendingTasksCount = pendingTasks.length;

  // Calculate tasks due this week
  const tasksDueThisWeek = pendingTasks.filter((task) => {
    const dueDate = new Date(task.dueDate); // dueDate is in YYYY-MM-DD format
    const today = new Date();

    // Get the start of this week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get the end of this week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Set dueDate to start of day for proper comparison
    dueDate.setHours(0, 0, 0, 0);

    return dueDate >= startOfWeek && dueDate <= endOfWeek;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <CardWidget
        title="Next Rent Payment"
        value={rentAmount ? `$${rentAmount.toLocaleString()}` : "N/A"}
        subtitle="Due in 5 days (April 1)"
      />

      <CardWidget
        title="Lease Status"
        value={leaseStatus}
        subtitle={
          leaseStatus === "N/A"
            ? "Not available yet"
            : "Remaining on current lease"
        }
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
