import dayjs from "dayjs";
import { LeavesStatus } from "src/constants/status";
import { Shift } from "src/types";
import { Country } from "country-state-city";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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

export const getAbbreviatedDays = (days: string[]): string[] => {
  return days.map((day) => dayAbbreviations[day] || day);
};

export const wait = (time: number): Promise<void> => {
  return new Promise((res) => setTimeout(res, time));
};

export const formatDate = (dateString: Date | null, dateFromat: string) => {
  return dayjs(dateString).format(dateFromat);
};

export const formatTime = (timeString: Date | null) => {
  return dayjs(timeString).format("hh:mm A");
};

export const formatDateWithTime = (date: string | Date | null): string => {
  return dayjs(date).format("MMM DD ddd, hh:mm A");
};

export const formatDuration = (durationMs: number): string => {
  const durationObj = dayjs.duration(durationMs);
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min${
    minutes !== 1 ? "s" : ""
  }`;
};

export const getDayOfWeek = (dateString: number) => {
  return dayjs(dateString).format("ddd");
};

export const getTimeZones = (currentCountry: any, userTimeZones: any) => {
  const country = Country.getCountryByCode(currentCountry);
  const timeZone = country?.timezones;
  const filterTimeZones = Array.from(
    new Set(timeZone?.map((item) => item.tzName))
  )
    .map((tzName) => {
      return timeZone?.find((item) => item.tzName === tzName);
    })
    .filter((item) => item !== undefined);
  userTimeZones(filterTimeZones);
};

export const getUserTimeZone = () => {
  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return systemTimezone;
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
