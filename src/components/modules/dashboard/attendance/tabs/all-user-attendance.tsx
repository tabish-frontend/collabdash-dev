// ** React Imports
import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import {
  Box,
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  CheckCircleOutline,
  ClockTimeThreeOutline,
  CloseCircleOutline,
  TimerSandEmpty,
} from "mdi-material-ui";
import { AttendanceStatus, LeavesStatus } from "src/constants/status";
import { attendanceApi } from "src/api";
import { Holiday, Leaves, Shift } from "src/types";
import { StatusIndicator, headerStatus } from "../attendance-status-indicator";
import { formatTime } from "src/utils/helpers";

export const AllUserAttendance = ({ filters }: any) => {
  const [employees, setEmployees] = useState<undefined | []>([]);

  const handleGetAttendances = async () => {
    const response = await attendanceApi.getAllUserAttendance(filters);

    setEmployees(response.data);
  };

  useEffect(() => {
    handleGetAttendances();
  }, []);

  const isPastDate = (date: Date, joinDate: Date) => {
    return date < joinDate;
  };

  const isFutureDate = (date: Date, currentDate: Date) => {
    return date > currentDate;
  };

  const isOnLeave = (date: Date, leaves: any[]) => {
    return leaves.some(
      (leave) =>
        new Date(leave.startDate) <= date &&
        date <= new Date(leave.endDate) &&
        leave.status === LeavesStatus.Approved
    );
  };

  const isOnHoliday = (date: Date, holidays: any[]) => {
    return holidays.some(
      (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
    );
  };

  const isOnWeekend = (date: Date, shift: any, joinDate: Date) => {
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });

    if (date < joinDate) {
      return false;
    }

    return shift?.weekends.includes(dayOfWeek);
  };

  const renderBadge = (
    dayAttendance: { timeOut: any; status: string; timeIn: any },
    date: number,
    joinDate: Date,
    currentDate: Date,
    month: number,
    year: number,
    leaves: Leaves[],
    holidays: Holiday[],
    shift: Shift
  ) => {
    const viewingDate = new Date(year, month - 1, date);
    const dayOfDate = viewingDate.toLocaleString("en-US", { weekday: "long" });

    if (isOnLeave(viewingDate, leaves)) {
      return (
        <Tooltip title="On Leave">
          <span>
            <StatusIndicator status="Leave" />
          </span>
        </Tooltip>
      );
    }

    if (isOnHoliday(viewingDate, holidays)) {
      return (
        <Tooltip title="Holiday">
          <span>
            <StatusIndicator status="Holiday" />
          </span>
        </Tooltip>
      );
    }

    if (isOnWeekend(viewingDate, shift, joinDate)) {
      return (
        <Tooltip title="Weekend">
          <span>
            <StatusIndicator status="Weekend" />
          </span>
        </Tooltip>
      );
    }

    if (dayAttendance) {
      if (dayAttendance.status === AttendanceStatus.SHORT_ATTENDANCE) {
        return (
          <Tooltip
            title={
              <div>
                <h4>{dayAttendance.status.toUpperCase()}</h4>
                <p>Time In: {formatTime(dayAttendance.timeIn)}</p>
                <p>Time out: {formatTime(dayAttendance.timeOut)}</p>
              </div>
            }
          >
            <span>
              <TimerSandEmpty sx={{ fontSize: 16 }} color="success" />
            </span>
          </Tooltip>
        );
      } else if (dayAttendance.status === AttendanceStatus.FULL_DAY_PRESENT) {
        return (
          <Tooltip
            title={
              <div>
                <h4>{dayAttendance.status.toUpperCase()}</h4>
                <p>Time In: {formatTime(dayAttendance.timeIn)}</p>
                <p>Time out: {formatTime(dayAttendance.timeOut)}</p>
              </div>
            }
          >
            <span>
              <CheckCircleOutline sx={{ fontSize: 16 }} color="success" />
            </span>
          </Tooltip>
        );
      } else if (dayAttendance.status === AttendanceStatus.HALF_DAY_PRESENT) {
        return (
          <Tooltip
            title={
              <div>
                <h4>{dayAttendance.status.toUpperCase()}</h4>
                <p>Time In: {formatTime(dayAttendance.timeIn)}</p>
                <p>Time out: {formatTime(dayAttendance.timeOut)}</p>
              </div>
            }
          >
            <span>
              <ClockTimeThreeOutline sx={{ fontSize: 18 }} color="warning" />
            </span>
          </Tooltip>
        );
      } else {
        return (
          <Tooltip
            title={
              <div>
                <h4>Online</h4>
                <p>Time In: {formatTime(dayAttendance.timeIn)}</p>
                <p>
                  Time out:{" "}
                  {dayAttendance.timeOut
                    ? formatTime(dayAttendance.timeOut)
                    : null}
                </p>
              </div>
            }
          >
            <span>
              <Box
                width={8}
                height={8}
                m={1}
                borderRadius="50%"
                bgcolor={"green"}
              />
            </span>
          </Tooltip>
        );
      }
    } else {
      if (isPastDate(viewingDate, joinDate)) {
        return (
          <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
        );
      } else if (isFutureDate(viewingDate, currentDate)) {
        const shiftDay = shift?.times.find((time) =>
          time.days.includes(dayOfDate)
        );

        return (
          <Tooltip
            title={
              shiftDay ? (
                <div>
                  <p>Start Time: {formatTime(shiftDay.start)}</p>
                  <p>End Time: {formatTime(shiftDay.end)}</p>
                </div>
              ) : (
                "No shift found"
              )
            }
          >
            <Box
              width={4}
              height={4}
              m={2}
              borderRadius="50%"
              bgcolor={"#ddd"}
            />
          </Tooltip>
        );
      } else {
        return (
          <Tooltip title={`${AttendanceStatus.FULL_DAY_ABSENT.toUpperCase()}`}>
            <CloseCircleOutline sx={{ fontSize: 18 }} color="error" />
          </Tooltip>
        );
      }
    }
  };

  return (
    <>
      <Stack direction="row" gap={1} my={4} flexWrap={"wrap"}>
        {headerStatus.map((item: any, index: number) => {
          return (
            <Stack
              direction="row"
              spacing={2}
              key={index}
              alignItems={"center"}
            >
              {item.icon}
              <Typography variant="subtitle1" lineHeight={1}>
                {item.title}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      <TableContainer component={Paper}>
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              {[...Array(31)].map((_, index) => (
                <TableCell key={index + 1}>{index + 1}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {!employees ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="h6">Loading....</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.full_name}</TableCell>
                  {[...Array(31)].map((_, index) => {
                    const date = index + 1;
                    const currentDate = new Date();

                    const joinDate = new Date(item.join_date);

                    const dayAttendance = item.attendance.find(
                      (attendanceItem: { date: string | number | Date }) =>
                        new Date(attendanceItem.date).getDate() === date
                    );

                    return (
                      <TableCell key={index} sx={{ p: 0 }} align="center">
                        {renderBadge(
                          dayAttendance,
                          date,
                          joinDate,
                          currentDate,
                          filters.month,
                          filters.year,
                          item.leaves,
                          item.holidays,
                          item.shift
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
