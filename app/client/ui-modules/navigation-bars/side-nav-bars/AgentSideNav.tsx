import React from "react";
import { MultipleHousesIcon } from "../../theming/icons/MultipleHousesIcon";
import { CalendarIcon } from "../../theming/icons/CalendarIcon";

export const agentLinks = [
  { to: "/", label: "Overview" },
  {
    to: "/properties",
    label: "Managed Properties",
    icon: <MultipleHousesIcon variant="light" />,
  },
  {
    to: "/calendar",
    label: "Calendar",
    icon: <CalendarIcon variant="light" />,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: <CalendarIcon variant="light" />,
  },
];
