// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useEffect, useState } from "react";
import { attendanceApi } from "src/api";
import { formatDate, formatDuration, formatTime } from "src/utils/helpers";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

const columns = [
  "Date",
  "ClockIn Time",
  "ClockOut Time",
  "Status",
  "Production",
];

export const MyAttendance = ({ filters }: any) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const { user } = useAuth<AuthContextType>();

  const fetchAndProcessData = async () => {
    const response = await attendanceApi.getMyAttendance(filters);
    const attendanceData = response.data.attendance;

    const currentDate = new Date();
    const selectedMonth = filters.month;
    const selectedYear = filters.year;

    // Get the number of days in the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const joinDate = new Date(user?.join_date || new Date());

    const attendanceList = [];

    for (let date = 1; date <= daysInMonth; date++) {
      const currentViewingDate = new Date(
        selectedYear,
        selectedMonth - 1,
        date
      );
      let dayAttendance = attendanceData.find(
        (item: any) => new Date(item.date).getDate() === date
      );

      if (
        !dayAttendance &&
        currentViewingDate >= joinDate &&
        currentViewingDate <= currentDate
      ) {
        dayAttendance = {
          date: currentViewingDate,
          timeIn: null,
          timeOut: null,
          status: "Absent",
        };
      }

      if (currentViewingDate >= joinDate && currentViewingDate <= currentDate) {
        attendanceList.push(dayAttendance);
      }
    }

    setAttendance(attendanceList.reverse());
  };

  useEffect(() => {
    fetchAndProcessData();
  }, [filters]);

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
            {attendance.map((attendance, index) => (
              <TableRow hover role="checkbox" key={index}>
                <TableCell align="center">
                  {formatDate(attendance.date)}
                </TableCell>
                <TableCell align="center">
                  {attendance.timeIn ? formatTime(attendance.timeIn) : "--"}
                </TableCell>
                <TableCell align="center">
                  {attendance.timeOut ? formatTime(attendance.timeOut) : "--"}
                </TableCell>
                <TableCell align="center">
                  {attendance.status.toUpperCase()}
                </TableCell>
                <TableCell align="center">
                  {attendance.timeIn && attendance.timeOut
                    ? formatDuration(attendance.timeIn, attendance.timeOut)
                    : "--"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
