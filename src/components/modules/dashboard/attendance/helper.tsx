import React from "react";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { CloseCircleOutline } from "mdi-material-ui";
import {
  formatDuration,
  formatTime,
  isFutureDate,
  isOnHoliday,
  isOnLeave,
  isOnWeekend,
  isPastDate,
} from "src/utils";
import { StatusIndicator } from "src/constants/attendance-status";
import { getStatusDetails } from "src/utils/get-attendance-status";

export const CellValues = (employeeAttendance: any, date: any) => {
  const dayOfDate = date.toLocaleString("en-US", { weekday: "long" });

  const shiftDay = employeeAttendance.shift?.times.find((item: any) =>
    item.days.includes(dayOfDate)
  );

  const shiftValues = {
    type: employeeAttendance.shift?.shift_type || "--",
    start:
      employeeAttendance.shift?.shift_type === "Fixed"
        ? shiftDay
          ? formatTime(shiftDay?.start)
          : "-"
        : "-",
    end:
      employeeAttendance.shift?.shift_type === "Fixed"
        ? shiftDay
          ? formatTime(shiftDay?.end)
          : "-"
        : "-",
    hours: employeeAttendance.shift
      ? employeeAttendance.shift.shift_type === "Fixed"
        ? shiftDay
          ? `${Math.round(
              (new Date(shiftDay?.end).getTime() -
                new Date(shiftDay?.start).getTime()) /
                3600000
            )} hours`
          : "-"
        : `${employeeAttendance.shift?.hours} hours`
      : "-",
  };

  const dayAttendance = employeeAttendance.attendance.find(
    (attendanceItem: any) =>
      dayjs(attendanceItem.date).isSame(dayjs(date), "day")
  );

  const attendanceValues = {
    clockIn: dayAttendance ? formatTime(dayAttendance.timeIn) : null,
    clockOut: dayAttendance
      && dayAttendance.timeOut
        ? formatTime(dayAttendance.timeOut)
        
      : null,
    duration: dayAttendance
      ? dayAttendance?.duration
        ? formatDuration(dayAttendance?.duration)
        : "--"
      : "--",
  };

  if (dayAttendance) {
    const { icon, title } = getStatusDetails(dayAttendance.status);

    return {
      icon: icon,
      tooltip: (
        <div>
          <h4>{title}</h4>
          <p>Time In: {attendanceValues.clockIn}</p>
          <p>Time Out: {attendanceValues.clockOut}</p>
        </div>
      ),
      open: true,
      status: title,
      shift: shiftValues,
      attendance: {
        id: dayAttendance ? dayAttendance._id : "",
        clockIn: dayAttendance ? dayAttendance.timeIn : null,
        clockOut: (dayAttendance && dayAttendance.timeOut)
            ? dayAttendance.timeOut
            : null,
     
        duration: dayAttendance
          ? dayAttendance?.duration
            ? formatDuration(dayAttendance?.duration)
            : "--"
          : "--",
      },
    };
  }

  if (isOnLeave(date, employeeAttendance.leaves)) {
    return {
      icon: <StatusIndicator status="Leave" />,
      tooltip: "On Leave",
      status: "On Leave",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isOnHoliday(date, employeeAttendance.holidays)) {
    return {
      icon: <StatusIndicator status="Holiday" />,
      tooltip: "Holiday",
      status: "Holiday",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (
    isOnWeekend(
      date,
      employeeAttendance.shift,
      new Date(employeeAttendance.join_date)
    )
  ) {
    return {
      icon: <StatusIndicator status="Weekend" />,
      tooltip: "Weekend",
      status: "Weekend",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isPastDate(date, new Date(employeeAttendance.join_date))) {
    return {
      icon: (
        <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
      ),
      tooltip: `Join Date: ${dayjs(employeeAttendance.join_date).format(
        "DD MMMM YYYY"
      )}`,
      status: "Not Joined",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isFutureDate(date, new Date())) {
    return {
      icon: (
        <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
      ),
      tooltip: (
        <div>
          <h4>{shiftValues.type}</h4>
          {shiftValues.type === "Fixed" ? (
            <>
              <p>Start Time: {shiftValues.start}</p>
              <p>End Time: {shiftValues.end}</p>
            </>
          ) : (
            <p>{shiftValues.hours}</p>
          )}
        </div>
      ),
      status: "Future Date",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  return {
    icon: <CloseCircleOutline sx={{ fontSize: 18 }} color="error" />,
    tooltip: "Absent",
    status: "Absent",
    shift: shiftValues,
    attendance: attendanceValues,
  };
};
