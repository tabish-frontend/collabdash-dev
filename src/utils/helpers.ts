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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

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

export const formatDate = (dateString: number, withDay: boolean = false) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (withDay) {
    options.weekday = "short";
  }

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
  shift: Shift | undefined,
  timeIn: string,
  timeOut: string | null,
  breaks: { start: string; end: string | null }[]
) => {
  if (!timeIn) return 0;

  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  let shiftDuration = 9 * 60 * 60 * 1000; // Default to 9 hours in milliseconds

  if (shift) {
    if (shift.shift_type === "Fixed") {
      const shiftTime = shift.times.find((time) =>
        time.days.includes(currentDay)
      );
      if (shiftTime) {
        const start = shiftTime.start ? new Date(shiftTime.start).getTime() : 0;
        const end = shiftTime.end ? new Date(shiftTime.end).getTime() : 0;
        shiftDuration = end - start;
      }
    } else if (shift.shift_type === "Flexible") {
      shiftDuration = shift.hours * 60 * 60 * 1000; // Convert hours to milliseconds
    }
  }

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

  // return (workingTime / shiftDuration) * 100;
  return {
    workingTime,
    shiftDuration,
  };
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

export const capitalizeWord = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const removeFirstCharacter = (word: string): string => {
  return word.slice(1);
};

export const getDay_Time = (date: string | Date | null) => {
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

export const isPastDate = (date: Date, joinDate: Date): boolean => {
  return date < joinDate;
};

export const isFutureDate = (date: Date, currentDate: Date): boolean =>
  date > currentDate;

export const isOnLeave = (date: Date, leaves: any[]): boolean => {
  // Normalize the provided date to remove the time part
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return leaves.some((leave) => {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    // Normalize the leave start and end dates to remove the time part
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return (
      startDate <= normalizedDate &&
      normalizedDate <= endDate &&
      leave.status === LeavesStatus.Approved
    );
  });
};

export const isOnHoliday = (date: Date, holidays: any[]): boolean =>
  holidays.some(
    (holiday) =>
      new Date(holiday.date).toDateString() === new Date(date).toDateString()
  );

export const isOnWeekend = (date: Date, shift: any, joinDate: Date): boolean =>
  date >= joinDate &&
  shift?.weekends.includes(date.toLocaleString("en-US", { weekday: "long" }));
