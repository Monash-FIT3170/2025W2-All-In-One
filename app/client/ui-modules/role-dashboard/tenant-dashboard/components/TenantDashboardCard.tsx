import React from "react";
import { CardWidget } from "../../../common/CardWidget";
import { Progress } from "../../components/ProgressBar";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { useAppSelector } from "../../../../store";
import {
  selectLeaseStatusKind,
  selectLeaseMonthsRemaining,
  LeaseStatusKind,
} from "../state/reducers/tenant-dashboard-slice";
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from "date-fns";

interface DashboardCardsProps {
  rentAmount?: number;
  tasks?: Task[];
}

function DashboardCards({ rentAmount, tasks = [] }: DashboardCardsProps) {
  // Get state values from Redux
  const leaseStatusKind = useAppSelector(selectLeaseStatusKind);
  const leaseMonthsRemaining = useAppSelector(selectLeaseMonthsRemaining);
  const leaseTerm = useAppSelector((state) => state.tenantProperty.leaseTerm);

  // Calculate pending tasks (not completed)
  const pendingTasks = tasks.filter((t) => t.status !== TaskStatus.COMPLETED);
  const pendingTasksCount = pendingTasks.length;

  // Calculate tasks due this week
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });

  const tasksDueThisWeek = pendingTasks.filter((t) => {
    const due = parseISO(t.dueDate); // YYYY-MM-DD
    return isWithinInterval(due, { start, end });
  }).length;

  // Determine lease display values based on lease status
  const getLeaseDisplayInfo = () => {
    switch (leaseStatusKind) {
      case LeaseStatusKind.Active:
        return {
          value: `${leaseMonthsRemaining} months`,
          subtitle: "Remaining on current lease",
        };
      case LeaseStatusKind.NotAvailable:
      default:
        return {
          value: "N/A",
          subtitle: "Lease information not available",
        };
    }
  };

  const leaseInfo = getLeaseDisplayInfo();

  // Format lease term for display
  const getLeasePeriodDisplay = () => {
    // If lease status is not available, don't show lease term
    if (leaseStatusKind === LeaseStatusKind.NotAvailable) {
      return "N/A";
    }
    
    // Only show lease term if tenant has active lease
    switch (leaseTerm) {
      case "month_to_month":
        return "Month to month";
      case "6_months":
        return "6 months";
      case "12_months":
        return "12 months";
      default:
        return leaseTerm ? leaseTerm.replace(/_/g, " ") : "N/A";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <CardWidget
        title="Next Rent Payment"
        value={rentAmount ? `$${rentAmount.toLocaleString()}` : "N/A"}
        subtitle="Due in 5 days (April 1)"
      />

      <CardWidget
        title="Lease Status"
        value={leaseInfo.value}
        subtitle={leaseInfo.subtitle}
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
        title="Lease Period"
        value={getLeasePeriodDisplay()}
        subtitle={leaseStatusKind === LeaseStatusKind.NotAvailable ? "No lease information" : "Current lease term"}
      />
    </div>
  );
}

export default DashboardCards;
