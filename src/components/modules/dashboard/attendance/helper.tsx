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

export const CellValues = (employee: any, date: any) => {
  const dayOfDate = date.toLocaleString("en-US", { weekday: "long" });
  const shiftDay = employee.shift?.times.find((item: any) =>
    item.days.includes(dayOfDate)
  );

  const shiftValues = {
    type: employee.shift?.shift_type || "--",
    start:
      employee.shift?.shift_type === "Fixed"
        ? shiftDay
          ? formatTime(shiftDay?.start)
          : "-"
        : "-",
    end:
      employee.shift?.shift_type === "Fixed"
        ? shiftDay
          ? formatTime(shiftDay?.end)
          : "-"
        : "-",
    hours: employee.shift
      ? employee.shift.shift_type === "Fixed"
        ? shiftDay
          ? `${Math.round(
              (new Date(shiftDay?.end).getTime() -
                new Date(shiftDay?.start).getTime()) /
                3600000
            )} hours`
          : "-"
        : `${employee.shift?.hours} hours`
      : "-",
  };

  const dayAttendance = employee.attendance.find((attendanceItem: any) =>
    dayjs(attendanceItem.date).isSame(dayjs(date), "day")
  );

  const attendanceValues = {
    id: dayAttendance ? dayAttendance._id : "",
    clockIn: dayAttendance ? dayAttendance.timeIn : null,
    clockOut:
      dayAttendance && dayAttendance.timeOut ? dayAttendance.timeOut : null,
    duration:
      dayAttendance && dayAttendance?.duration
        ? formatDuration(dayAttendance?.duration)
        : "--",
    breaks: dayAttendance && dayAttendance.breaks,
  };

  if (dayAttendance) {
    const { icon, title } = getStatusDetails(dayAttendance.status);
    return {
      icon: icon,
      tooltip: (
        <div>
          <h4>{title}</h4>
          <p>
            <span>
              {`Time In: ${
                attendanceValues.clockIn
                  ? formatTime(attendanceValues.clockIn)
                  : "--"
              }`}
            </span>
            &nbsp; &nbsp;
            <span>
              {`Time Out: ${
                attendanceValues.clockOut
                  ? formatTime(attendanceValues.clockOut)
                  : "--"
              }`}
            </span>
          </p>
          {attendanceValues.breaks.length ? (
            <>
              <h4>Breaks</h4>
              {attendanceValues.breaks.map((item: any, index: number) => (
                <p key={index}>
                  <span>
                    {`Break Start: ${
                      item.start ? formatTime(item.start) : "--"
                    }`}
                  </span>
                  &nbsp; &nbsp;
                  <span>
                    {`Break End: ${item.end ? formatTime(item.end) : "--"}`}
                  </span>
                </p>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
      ),
      open: true,
      status: title,
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isOnWeekend(date, employee.shift, new Date(employee.join_date))) {
    return {
      icon: <StatusIndicator status="Weekend" />,
      tooltip: "Weekend",
      status: "Weekend",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isOnHoliday(date, employee.holidays)) {
    return {
      icon: <StatusIndicator status="Holiday" />,
      tooltip: "Holiday",
      status: "Holiday",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isOnLeave(date, employee.leaves)) {
    return {
      icon: <StatusIndicator status="Leave" />,
      tooltip: "On Leave",
      status: "On Leave",
      shift: shiftValues,
      attendance: attendanceValues,
    };
  }

  if (isPastDate(date, new Date(employee.join_date))) {
    return {
      icon: (
        <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
      ),
      tooltip: `Join Date: ${dayjs(employee.join_date).format("DD MMMM YYYY")}`,
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
