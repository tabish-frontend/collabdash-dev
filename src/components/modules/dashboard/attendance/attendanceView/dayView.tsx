// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { CellValues } from "../helper";
import { Skeleton, Stack } from "@mui/material";
import NoRecordFound from "src/components/shared/NoRecordFound";

const columns = [
  "Full Name",
  "Shift Type",
  "Shift Start",
  "Shift End",
  "Working Hours",
  "ClockIn Time",
  "ClockOut Time",
  "Duration",
  "Status",
];

export const DayViewAttendance = ({
  employeesAttendance,
  filters,
  isLoading,
}: any) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
            ) : employeesAttendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            ) : (
              employeesAttendance.map((attendance: any, index: number) => {
                const attendanceValues = CellValues(attendance, filters.date);

                return (
                  <TableRow hover key={index}>
                    <TableCell align="center">{attendance.full_name}</TableCell>
                    <TableCell align="center">
                      {attendanceValues.shift.type}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.shift.start}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.shift.end}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.shift.hours}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.attendance.clockIn}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.attendance.clockOut}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.attendance.duration}
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.status}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
