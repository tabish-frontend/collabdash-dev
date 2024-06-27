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
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { attendanceApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import { CellValues } from "../helper";

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

    let selectedMonth;
    let selectedYear;
    let daysInMonth;

    if (filters.view === "day") {
      const date = new Date(filters.date);
      selectedMonth = date.getMonth() + 1; // getMonth() returns 0-based month
      selectedYear = date.getFullYear();
      daysInMonth = 1; // Only one day to process
    } else {
      selectedMonth = filters.month;
      selectedYear = filters.year;
      daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    }

    const attendanceList = [];

    for (let date = 1; date <= daysInMonth; date++) {
      const currentViewingDate =
        filters.view === "day"
          ? new Date(filters.date)
          : new Date(selectedYear, selectedMonth - 1, date);

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
            {isLoading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex} align="center">
                        <Skeleton variant="rounded" width="100%" height={15} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : attendance.map((attendance, index) => (
                  <TableRow hover role="checkbox" key={index}>
                    <TableCell align="center">
                      {formatDate(attendance.date)}
                    </TableCell>
                    <TableCell align="center">{attendance.timeIn}</TableCell>
                    <TableCell align="center">{attendance.timeOut}</TableCell>
                    <TableCell align="center">{attendance.status}</TableCell>
                    <TableCell align="center">{attendance.duration}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
