/**
 * @param time24 time in HH:mm format
 * @returns hour in integer
 */
export const hour = (time24: string): number => {
  const h = time24.split(":")[0];
  if (typeof h === "undefined") return -1;

  return parseInt(h);
};

/**
 * @param time24 time in HH:mm format
 * @returns minute in integer
 */
export const min = (time24: string): number => {
  const m = time24.split(":")[1];
  if (typeof m === "undefined") return -1;

  return parseInt(m);
};

/**
 * @param time24 time in HH:mm format
 * @returns 12 hour time string (e.g. 8:00 am)
 */
export const time12 = (time24: string): string => {
  const h = hour(time24);
  const m = time24.split(":")[1];

  return `${h % 12 || 12}:${m} ${h < 12 ? "am" : "pm"}`;
};

/**
 * @param displayedHours displayed hours of week view
 * @param rowIndex row index including half hour mark
 * @returns 12 hour time string (e.g. 8:00 am)
 * @returns empty string if row index is invalid
 */
// Convert week view row index to 12 hour time string without minute (e.g. 8 am)
export const rowToTime12 = (
  displayedHours: number[],
  rowIndex: number,
): string => {
  // Account for 2 rows per hour (MIN_PER_ROW is 30)
  const i = rowIndex / 2;
  if (!Number.isInteger(i)) return "";

  const h = displayedHours[i];
  if (typeof h === "undefined") return "";

  return `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;
};
