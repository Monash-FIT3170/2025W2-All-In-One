// src/components/Calendar.tsx
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../themes/calendar"; // Import your CSS file for custom styles


type Priority = "low" | "medium" | "high";
export type DateBadge = { total: number; counts: Partial<Record<Priority, number>> };
export type DateBadgesMap = Record<string, DateBadge>;


type Props = {
  onDateSelect: (formatted: string, iso: string) => void;
  selectedDateISO: string | null;
  dateBadges?: DateBadgesMap
};

const fmtISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;


export function Calendar({
  onDateSelect,
  selectedDateISO,
  dateBadges
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
  
  /////// If date is empty, bails out
  if (!dateStr) return;

  // converts it to format
  const iso = fmtISO(args.date)

  const badge = dateBadges?.[iso];
  const frame: HTMLElement =
    args.el.querySelector(".fc-daygrid-day-frame") ?? args.el;

  // remove old badges so we don't duplicate on rerenders
  frame.querySelector(".fc-badges")?.remove();

  if (!badge?.total) return;

  // building the pills
  const container = document.createElement("div");
  container.className = "absolute bottom-1 left-0 w-full flex gap-1 px-1";

  const high = badge.counts.high ?? 0;
  const med  = badge.counts.medium ?? 0;
  const dots = Math.min(badge.total, 3);

  for (let i = 0; i < dots; i++) {
  const dot = document.createElement("div");
  dot.className =
    "flex-1 h-2 rounded-full " +
    (i < high
      ? "bg-red-500"
      : i < high + med
      ? "bg-yellow-400"
      : "bg-green-500");
  container.appendChild(dot);
  }

  if (badge.total > 3) {
    const more = document.createElement("div");
    more.className = "absolute bottom-2 right-1 text-[10px] text-gray-600";
    more.textContent = `+${badge.total - 3}`;
    container.appendChild(more);
  }

  frame.appendChild(container);
      
  };

  return (
    <FullCalendar
      key={selectedDateISO} // Re-renders on date change
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      dayCellDidMount={dayCellDidMount}
      dateClick={handleDateClick}
      initialDate={selectedDateISO ?? undefined}
    />
  );
}
