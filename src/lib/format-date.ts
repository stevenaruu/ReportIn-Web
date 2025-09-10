const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Format ISO date string tanpa konversi timezone
 * Contoh: "2025-09-07T21:14:22.492Z"
 * Output: "08 Sep 2025 04:14"
 */
export function formatTableDate(dateStr: string): string {
  if (!dateStr) return "-";

  const [date, time] = dateStr.split("T");
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  // month index mulai dari 0
  const monthName = MONTHS[parseInt(month, 10) - 1];

  return `${day} ${monthName} ${year} ${hour}:${minute}`;
}
