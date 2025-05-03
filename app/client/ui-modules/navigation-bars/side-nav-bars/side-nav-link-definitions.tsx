import React from "react";
import { MultipleHousesIcon } from "../../theming/icons/MultipleHousesIcon";
import { CalendarIcon } from "../../theming/icons/CalendarIcon";

// Define the type for navigation links
export interface NavLinkItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export const agentDashboardLinks = [
  { to: "/agent-dashboard", label: "Overview" },
  { to: "/agent-properties", label: "Properties" },
  { to: "/agent-calendar", label: "Calendar" },
  { to: "/agent-tasks", label: "Tasks" },
  { to: "/agent-messages", label: "Messages" },
  { to: "/agent-analytics", label: "Analytics" },
];

export const tenantDashboardLinks = [
  { to: "/tenant-dashboard", label: "Overview" },
  { to: "/tenant-property", label: "My Property" },
  { to: "/tenant-calender", label: "Calendar" },
  { to: "/tenant-maintenance", label: "Maintenance" },
  { to: "/tenant-messages", label: "Messages" },
  { to: "/tenant-documents", label: "Documents" },
  { to: "/tenant-search-properties", label: "Search Properties" },
];

export const settingLinks: NavLinkItem[] = [
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export const agentLinks: NavLinkItem[] = [
  { to: "/", label: "Overview" },
  {
    to: "/properties",
    label: "Managed Properties",
    icon: <MultipleHousesIcon variant="light" />,
  },
  {
    to: "/calendar",
    label: "Calendar",
    icon: <CalendarIcon />,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: <CalendarIcon />,
  },
];

export const landlordLinks: NavLinkItem[] = [
  { to: "/", label: "Overview" },
  {
    to: "/properties",
    label: "Managed Properties",
    icon: <MultipleHousesIcon variant="light" />,
  },
  {
    to: "/calendar",
    label: "Calendar",
    icon: <CalendarIcon />,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: <CalendarIcon />,
  },
];

export const tenantLinks: NavLinkItem[] = [
  { to: "/", label: "Overview" },
  {
    to: "/properties",
    label: "Managed Properties",
    icon: <MultipleHousesIcon variant="light" />,
  },
  {
    to: "/calendar",
    label: "Calendar",
    icon: <CalendarIcon />,
  },
];
