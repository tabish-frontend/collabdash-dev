// ** React Imports
import { useCallback, useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import {
  Box,
  Card,
  Link,
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
import { RouterLink } from "src/components/shared";
import { paths } from "src/constants/paths";
import {
  isPastDate,
  isFutureDate,
  isOnHoliday,
  isOnLeave,
  isOnWeekend,
} from "src/utils/helpers";

interface AllUserAttendanceProps {
  filters: any;
  selectedUsers: string[]; // Array of selected user IDs
}

export const AllUserAttendance: React.FC<AllUserAttendanceProps> = ({
  filters,
  selectedUsers,
}) => {
  const [employees, setEmployees] = useState<undefined | []>([]);

  const handleGetAttendances = useCallback(async () => {
    const response = await attendanceApi.getAllUserAttendance(filters);
    let filteredEmployees = response.data;

    if (selectedUsers.length > 0) {
      filteredEmployees = filteredEmployees.filter((employee: any) =>
        selectedUsers.includes(employee._id)
      );
    }

    setEmployees(filteredEmployees);
  }, [filters, selectedUsers]);

  useEffect(() => {
    handleGetAttendances();
  }, [handleGetAttendances]);

  const renderTooltip = (
    title: string | JSX.Element,
    content: JSX.Element | null,
    icon: JSX.Element
  ): JSX.Element => (
    <Tooltip title={title}>
      <span>{content ? content : icon}</span>
    </Tooltip>
  );

  const renderAttendanceStatus = (
    status: string,
    timeIn: Date,
    timeOut: Date
  ): JSX.Element => (
    <Tooltip
      title={
        <div>
          <h4>{status.toUpperCase()}</h4>
          <p>Time In: {formatTime(timeIn)}</p>
          <p>Time out: {formatTime(timeOut)}</p>
        </div>
      }
    >
      <span>
        {status === AttendanceStatus.SHORT_ATTENDANCE && (
          <TimerSandEmpty sx={{ fontSize: 16 }} color="success" />
        )}
        {status === AttendanceStatus.FULL_DAY_PRESENT && (
          <CheckCircleOutline sx={{ fontSize: 16 }} color="success" />
        )}
        {status === AttendanceStatus.HALF_DAY_PRESENT && (
          <ClockTimeThreeOutline sx={{ fontSize: 18 }} color="warning" />
        )}
        {status !== AttendanceStatus.SHORT_ATTENDANCE &&
          status !== AttendanceStatus.FULL_DAY_PRESENT &&
          status !== AttendanceStatus.HALF_DAY_PRESENT && (
            <Box
              width={8}
              height={8}
              m={2.4}
              borderRadius="50%"
              bgcolor={"green"}
            />
          )}
      </span>
    </Tooltip>
  );

  const renderBadge = (
    dayAttendance: { timeOut: Date; status: string; timeIn: Date } | null,
    date: number,
    joinDate: Date,
    currentDate: Date,
    month: number,
    year: number,
    leaves: Leaves[],
    holidays: Holiday[],
    shift: Shift
  ): JSX.Element => {
    const viewingDate = new Date(year, month - 1, date);
    const dayOfDate = viewingDate.toLocaleString("en-US", { weekday: "long" });

    if (isOnLeave(viewingDate, leaves)) {
      return renderTooltip(
        "On Leave",
        null,
        <StatusIndicator status="Leave" />
      );
    }

    if (isOnHoliday(viewingDate, holidays)) {
      return renderTooltip(
        "Holiday",
        null,
        <StatusIndicator status="Holiday" />
      );
    }

    if (isOnWeekend(viewingDate, shift, joinDate)) {
      return renderTooltip(
        "Weekend",
        null,
        <StatusIndicator status="Weekend" />
      );
    }

    if (dayAttendance) {
      return renderAttendanceStatus(
        dayAttendance.status,
        dayAttendance.timeIn,
        dayAttendance.timeOut
      );
    } else {
      if (isPastDate(viewingDate, joinDate)) {
        return (
          <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
        );
      } else if (isFutureDate(viewingDate, currentDate)) {
        const shiftDay = shift?.times.find((time) =>
          time.days.includes(dayOfDate)
        );
        return renderTooltip(
          shiftDay ? (
            <div>
              <p>Start Time: {formatTime(shiftDay.start)}</p>
              <p>End Time: {formatTime(shiftDay.end)}</p>
            </div>
          ) : (
            "No shift found"
          ),
          null,
          <Box width={4} height={4} m={2} borderRadius="50%" bgcolor={"#ddd"} />
        );
      } else {
        return renderTooltip(
          `${AttendanceStatus.FULL_DAY_ABSENT.toUpperCase()}`,
          null,
          <CloseCircleOutline sx={{ fontSize: 18 }} color="error" />
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
                  <TableCell>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      href={`${paths.employees}/${item.username}`}
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {item.full_name}
                    </Link>
                  </TableCell>
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
