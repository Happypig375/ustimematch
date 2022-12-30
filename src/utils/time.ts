// return int hour and min of HH:MM
export const hour = (time: string): number =>
  parseInt(time.split(":")[0] as string);
export const min = (time: string): number =>
  parseInt(time.split(":")[1] as string);

// convert 24 hour to 12 hour time
export const parseTime = (time: string) => {
  const h = hour(time);
  const m = time.split(":")[1];

  return `${h % 12 || 12}:${m ? m.toString().padStart(2, "0") : 0} ${
    h < 12 ? "am" : "pm"
  }`;
};
