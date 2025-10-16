import { parse } from "date-fns";

export function getFormattedDateStringFromDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getFormattedTimeStringFromDate(date: Date): string {
  const timeString = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return timeString;
}

export function calculateDueDate(daysFromNow: number): Date {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);
  return dueDate;
}

export const getISODate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const getTodayISODate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getTodayAUDate = (): string => {
  return new Date().toLocaleDateString("en-AU");
};

/**
 * Parses a date string with multiple fallback formats for robust date handling
 * @param dateStr - The date string to parse
 * @returns Parsed Date object
 */
export function parseDateRobust(dateStr: string): Date {
  // Try parsing as dd/MM/yyyy first
  let date = parse(dateStr, "dd/MM/yyyy", new Date());
  if (isNaN(date.getTime())) {
    // If that fails, try parsing as ISO string or other formats
    date = new Date(dateStr);
  }
  return date;
}
