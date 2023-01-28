import { it, describe, expect } from "@jest/globals";
import { rowToTime12 } from "@utils/time";
import { time12 } from "./time";

const time24s = [
  { time24: "23:59", expected: "11:59 pm" },
  { time24: "00:00", expected: "12:00 am" },
  { time24: "00:01", expected: "12:01 am" },

  { time24: "11:59", expected: "11:59 am" },
  { time24: "12:00", expected: "12:00 pm" },
  { time24: "12:01", expected: "12:01 pm" },

  { time24: "03:00", expected: "3:00 am" },
  { time24: "06:00", expected: "6:00 am" },
  { time24: "09:00", expected: "9:00 am" },

  { time24: "15:00", expected: "3:00 pm" },
  { time24: "18:00", expected: "6:00 pm" },
  { time24: "21:00", expected: "9:00 pm" },

  { time24: "12:34", expected: "12:34 pm" },
];

const displayedHoursFull = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];
const rowIndexsFull = [
  { rowIndex: -1, expected: "" },
  { rowIndex: 0, expected: "12 am" },
  { rowIndex: 1, expected: "" },
  { rowIndex: 2, expected: "1 am" },
  { rowIndex: 3, expected: "" },
  { rowIndex: 4, expected: "2 am" },
  { rowIndex: 8, expected: "4 am" },
  { rowIndex: 16, expected: "8 am" },
  { rowIndex: 24, expected: "12 pm" },
  { rowIndex: 32, expected: "4 pm" },
  { rowIndex: 46, expected: "11 pm" },
  { rowIndex: 47, expected: "" },
  { rowIndex: 48, expected: "" },
  { rowIndex: 49, expected: "" },
];

const displayedHoursSome = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];
const rowIndexsSome = [
  { rowIndex: -1, expected: "" },
  { rowIndex: 0, expected: "8 am" },
  { rowIndex: 1, expected: "" },
  { rowIndex: 2, expected: "9 am" },
  { rowIndex: 3, expected: "" },
  { rowIndex: 4, expected: "10 am" },
  { rowIndex: 8, expected: "12 pm" },
  { rowIndex: 16, expected: "4 pm" },
  { rowIndex: 24, expected: "8 pm" },
  { rowIndex: 28, expected: "10 pm" },
  { rowIndex: 29, expected: "" },
  { rowIndex: 30, expected: "" },
  { rowIndex: 31, expected: "" },
];

describe("time utils", () => {
  it.each(time24s)(
    "can convert 24 hour time $time24 to 12 hour time $expected",
    ({ time24, expected }) => {
      expect(time12(time24)).toBe(expected);
    },
  );

  it.each(rowIndexsFull)(
    "can convert row index $rowIndex to $expected when using full displayed hours",
    ({ rowIndex, expected }) => {
      expect(rowToTime12(displayedHoursFull, rowIndex)).toBe(expected);
    },
  );

  it.each(rowIndexsSome)(
    "can convert row index $rowIndex to $expected when using some displayed hours",
    ({ rowIndex, expected }) => {
      expect(rowToTime12(displayedHoursSome, rowIndex)).toBe(expected);
    },
  );
});
