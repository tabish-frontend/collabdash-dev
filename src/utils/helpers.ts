import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Box, Tooltip } from "@mui/material";
import {
  CheckCircleOutline,
  ClockTimeThreeOutline,
  CloseCircleOutline,
  TimerSandEmpty,
} from "mdi-material-ui";
import { AttendanceStatus, LeavesStatus } from "src/constants/status";

import { attendanceApi } from "src/api";
import { Holiday, Leaves, Shift } from "src/types";
import { StatusIndicator } from "src/components/modules/dashboard/attendance/attendance-status-indicator";
import { headerStatus } from "src/components/modules/dashboard/attendance/attendance-status-indicator";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

// export const getTimeZone = (latitude : string, longitude: string) => {
//   return dayjs.tz.guess(latitude, longitude);
// }

import { FormikValues } from "formik";

const dayAbbreviations: { [key: string]: string } = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export const getChangedFields = <T extends FormikValues>(
  values: T,
  initialValues: T
): Partial<T> => {
  const changedFields: Partial<T> = {};

  for (const key in values) {
    const currentValue = values[key];
    const initialValue = initialValues[key];

    if (typeof currentValue === "string" && typeof initialValue === "string") {
      const trimmedCurrentValue = currentValue.trim();
      const trimmedInitialValue = initialValue.trim();

      if (trimmedCurrentValue !== trimmedInitialValue) {
        changedFields[key] = trimmedCurrentValue;
      }
    } else if (currentValue !== initialValue) {
      changedFields[key] = currentValue;
    }
  }

  return changedFields;
};

export const formatDuration = (durationMs: number) => {
  // const durationMs =
  //   new Date(endTime).getTime() - new Date(startTime).getTime();
  const totalMinutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${
    minutes !== 1 ? "s" : ""
  }`;
};

export const formatDob = (dateStr: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);

  return formatter.format(dateStr);
};

export const formatDate = (dateString: number) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export const getDayFromDate = (dateString: number) => {
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const formatTime = (timeString: Date | null) => {
  const date = timeString ? new Date(timeString) : new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleTimeString("en-US", options);
};

export const calculateWorkingPercentage = (
  timeIn: string,
  timeOut: string | null,
  breaks: { start: string; end: string | null }[]
) => {
  if (!timeIn) return 0;

  const shiftDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  const start = new Date(timeIn).getTime();
  const end = timeOut ? new Date(timeOut).getTime() : Date.now();

  let workingTime = end - start;
  let breakDuration = 0;

  // Calculate the total break duration
  breaks.forEach((breakItem) => {
    if (breakItem.end) {
      const breakStart = new Date(breakItem.start).getTime();
      const breakEnd = new Date(breakItem.end).getTime();
      breakDuration += breakEnd - breakStart;
    }
  });

  // If currently on a break, use the break start time
  if (breaks.length > 0 && !breaks[breaks.length - 1].end) {
    const breakStart = new Date(breaks[breaks.length - 1].start).getTime();
    workingTime = breakStart - start;
  } else {
    // Subtract the total break duration from working time
    workingTime -= breakDuration;
  }

  return (workingTime / shiftDuration) * 100;
};

export const getAbbreviatedDays = (days: string[]): string[] => {
  return days.map((day) => dayAbbreviations[day] || day);
};

export const getUpperCaseName = (name: string) => {
  return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getDayOfWeek = (date: Date) => {
  return dayjs(date).format("dddd");
};

export const getLocalDate = (date: any) => {
  const localDate = dayjs(date).tz("Asia/Karachi");
  return localDate.format("ddd MMM DD YYYY HH:mm:ss [GMT]Z (Z)");
};

export const getLocalFormattedDate = (date: Date | null): string => {
  return dayjs(date).format("D MMMM YYYY");
};

export const getLocalFormattedTime = (time: any) => {
  const localTime = dayjs.utc(time, "HH:mm:ss").tz();
  return localTime.format("hh:mm A");
};

export const getLocalFormattedDateTime = (slot: string) => {
  const localTime = dayjs.utc(slot).tz();
  return localTime.format("YYYY-MM-DD HH:mm:ss");
};

export const getUtcFomateTime = (time: string) => {
  return dayjs.utc(time).format("HH:mm:ss");
};

export const getUtcIsoStringFormat = (date_time: any) => {
  const date = dayjs(date_time).utc();
  return date.toISOString();
};

export const getClassDate = (date: any) => {
  return dayjs(date).format("D MMM YYYY");
};

export const getClassTime = (time: any) => {
  return dayjs(time).format("h:mm A");
};

export const getUserTimeZone = () => {
  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const countryStandardTimezoneName = moment.tz(systemTimezone).format("zzz");
  return systemTimezone;
};

export const getDuration = ({ startTime, endTime }: any) => {
  const startDate = dayjs(startTime);
  const endDate = dayjs(endTime);
  const durationHours = endDate.diff(startDate, "minutes");
  return durationHours;
};

export const getClassDuration = ({ startTime, endTime }: any) => {
  const startDate = dayjs(startTime);
  const endDate = dayjs(endTime);
  const durationMinutes = endDate.diff(startDate, "minutes");

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  let durationString = "";

  if (hours > 0) {
    durationString += `${hours} hr `;
  }

  if (minutes > 0 || (hours === 0 && minutes === 0)) {
    durationString += `${minutes} min`;
  }

  return durationString;
};

import { format } from "date-fns";

type Document = any;
type DocumentSort = Record<string, any>;

export const capitalizeWord = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const removeFirstCharacter = (word: string): string => {
  return word.slice(1);
};

export const getDay_Time = (date: string) => {
  const initialDate = dayjs(date);
  const dateOfWeek = initialDate.format("MMM DD ddd , HH:mm");
  return dateOfWeek;
};

export const removeLastCharacter = (word: string): string => {
  return word.slice(0, -1);
};

export const getID = (ID: any) => {
  return `TH-${ID.substr(-4)}`.toUpperCase();
};

export const wait = (time: number): Promise<void> => {
  return new Promise((res) => setTimeout(res, time));
};

export function applyPagination<T = Document>(
  documents: T[],
  page: number,
  rowsPerPage: number
): T[] {
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export const applySorting = (data: any) => {
  let filteredData = [...data];
  filteredData.sort((a, b) =>
    `${a.first_name} ${a.last_name}`.localeCompare(
      `${b.first_name} ${b.last_name}`
    )
  );

  return filteredData;
};

function descendingComparator(
  a: DocumentSort,
  b: DocumentSort,
  sortBy: string
): number {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  if (b[sortBy]! < a[sortBy]!) {
    return -1;
  }

  if (b[sortBy]! > a[sortBy]!) {
    return 1;
  }

  return 0;
}

function getComparator(sortDir: string, sortBy: string) {
  return sortDir === "desc"
    ? (a: DocumentSort, b: DocumentSort) => descendingComparator(a, b, sortBy)
    : (a: DocumentSort, b: DocumentSort) => -descendingComparator(a, b, sortBy);
}

export function applySort<T = DocumentSort>(
  documents: T[],
  sortBy: string,
  sortDir: "asc" | "desc"
): T[] {
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = documents.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
}

// eslint-disable-next-line consistent-return
export function deepCopy(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, index) => {
      arr[index] = deepCopy(item);
      return arr;
    }, []);
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj: any, key) => {
      newObj[key] = deepCopy(obj[key]);
      return newObj;
    }, {});
  }
}

export const getDate = (date: Date): string => format(date, "MM-dd-yyyy");

// Function to get the current date in UTC format
export const getCurrentUTCDate = () => {
  const now = new Date();
  const utcDate = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    )
  );
  return utcDate.toISOString(); // Convert to ISO 8601 format (e.g., "2023-07-21T12:34:56.789Z")
};

export const roleReplace = (path: string, role: string) =>
  path.replace("ROLE", role);

export const isPastDate = (date: Date, joinDate: Date): boolean =>
  date < joinDate;

export const isFutureDate = (date: Date, currentDate: Date): boolean =>
  date > currentDate;

export const isOnLeave = (date: Date, leaves: any[]): boolean =>
  leaves.some(
    (leave) =>
      new Date(leave.startDate) <= date &&
      date <= new Date(leave.endDate) &&
      leave.status === LeavesStatus.Approved
  );

export const isOnHoliday = (date: Date, holidays: any[]): boolean =>
  holidays.some(
    (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
  );

export const isOnWeekend = (date: Date, shift: any, joinDate: Date): boolean =>
  date >= joinDate &&
  shift?.weekends.includes(date.toLocaleString("en-US", { weekday: "long" }));
