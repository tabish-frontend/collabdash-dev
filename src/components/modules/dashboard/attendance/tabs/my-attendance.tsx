// ** MUI Imports
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { attendanceApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import { CellValues } from "../helper";
import dayjs from "dayjs";
import { NoRecordFound } from "src/components/shared";

const columns = [
  "Date",
  "ClockIn Time",
  "ClockOut Time",
  "Status",
  "Production",
];

export const MyAttendance = ({ filters }: any) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAndProcessData = useCallback(async () => {
    setIsLoading(true);
    const response = await attendanceApi.getMyAttendance(filters);
    const attendanceData = response.data.data;

    let daysInMonth;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const filterMonth = new Date(filters.date).getMonth();
    const filterYear = new Date(filters.date).getFullYear();

    if (filters.view === "day") {
      daysInMonth = 1; // Only one day to process
    } else if (filterMonth === currentMonth && filterYear === currentYear) {
      daysInMonth = new Date().getDate(); // Up to today if it's the current month
    } else {
      daysInMonth = dayjs(filters.date).daysInMonth(); // Full month
    }

    const attendanceList = [];

    for (let date = 1; date <= daysInMonth; date++) {
      const currentViewingDate =
        filters.view === "day"
          ? new Date(filters.date)
          : dayjs(filters.date).set("date", date);

      const attendanceValues = CellValues(attendanceData, currentViewingDate);

      const dayAttendance = {
        date: currentViewingDate,
        timeIn: attendanceValues.attendance.clockIn,
        timeOut: attendanceValues.attendance.clockOut,
        duration: attendanceValues.attendance.duration,
        status: attendanceValues.status,
      };

      attendanceList.push(dayAttendance);
    }

    setAttendance(attendanceList.reverse());
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align="center">
                  <span style={{ fontWeight: 700 }}>{column}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} align="center">
                      <Skeleton variant="rounded" width="100%" height={15} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((attendance, index) => (
                <TableRow hover role="checkbox" key={index}>
                  <TableCell align="center">
                    <Typography minWidth={150}>
                      {formatDate(attendance.date)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography minWidth={150}>{attendance.timeIn}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography minWidth={150}>{attendance.timeOut}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography minWidth={150}>{attendance.status}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography minWidth={150}>
                      {attendance.duration}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
