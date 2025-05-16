// src/components/Calendar.tsx
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../themes/calendar"; // Import your CSS file for custom styles

type Props = {
  onDateSelect: (formatted: string, iso: string) => void;
  selectedDateISO: string | null;
};

export function Calendar({
  onDateSelect,
  selectedDateISO,
}: Props): React.JSX.Element {
  const getSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr; // This should be in YYYY-MM-DD format
    const date = new Date(clickedDate);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const formatted = `${day}${getSuffix(day)} ${month} ${year}`;
    onDateSelect(formatted, clickedDate);
  };

  const dayCellDidMount = (args: any) => {
    // Normalize args.date to UTC and convert to YYYY-MM-DD
    const dateStr = args.date
      ? new Date(
          Date.UTC(
            args.date.getFullYear(),
            args.date.getMonth(),
            args.date.getDate()
          )
        )
          .toISOString()
          .split("T")[0]
      : undefined;

    // Compare normalized dateStr with selectedDateISO
    const isSelected = selectedDateISO && dateStr === selectedDateISO;

    // Ensure the correct cell is targeted
    if (args.el) {
      // Remove the 'selected-day' class from all cells
      args.el.classList.remove("selected-day");

      // Add the 'selected-day' class to the correct cell
      if (isSelected) {
        args.el.classList.add("selected-day");
      }
    }
  };

  return (
    <FullCalendar
      key={selectedDateISO} // Re-renders on date change
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      dayCellDidMount={dayCellDidMount}
      dateClick={handleDateClick}
    />
  );
}
