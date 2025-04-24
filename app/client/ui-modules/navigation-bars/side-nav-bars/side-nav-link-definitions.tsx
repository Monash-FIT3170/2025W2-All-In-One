import React from "react";
import { MultipleHousesIcon } from "../../theming/icons/MultipleHousesIcon";
import { CalendarIcon } from "../../theming/icons/CalendarIcon";

// Define the type for navigation links
export interface NavLinkItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

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
