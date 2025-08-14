export function getFormattedDateStringFromDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getFormattedTimeStringFromDate(date: Date): string {
  const timeString = date
    .toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return timeString;
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