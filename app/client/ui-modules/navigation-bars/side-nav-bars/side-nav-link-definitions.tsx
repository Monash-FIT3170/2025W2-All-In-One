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
  { to: "/agent-messages", label: "Messages" },
  { to: "/agent-documents", label: "Documents"},
];

export const tenantDashboardLinks = [
  { to: "/tenant-dashboard", label: "Overview" },
  { to: "/tenant-property", label: "My Property" },
  { to: "/tenant-calendar", label: "Calendar" },
  { to: "/tenant-messages", label: "Messages" },
  { to: "/tenant-documents", label: "Documents" },
];

export const landlordDashboardLinks = [
  { to: "/landlord-dashboard", label: "Overview" },
  { to: "/landlord-properties", label: "Properties" },
  { to: "/landlord-calendar", label: "Calendar" },
  { to: "/landlord-documents", label: "Documents" },
  { to: "/landlord-messages", label: "Messages" },
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
