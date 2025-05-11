
export function getFormattedDateStringFromDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getFormattedTimeStringFromDate(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}`;
}