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
import { NoRecordFound } from "src/components/shared";
import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { EditAttendanceModal } from "./edit-attendance";
import { formatTime } from "src/utils";

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

interface ModalValuesTypes {
  open: boolean;
  attendance: {
    id: string;
    clockInTime: null | Date;
    clockOutTime: null | Date;
  };
}

export const DayViewAttendance = ({
  employeesAttendance,
  filters,
  handleEditAttendance,
}: any) => {
  const modalnitialValues = {
    open: false,
    attendance: {
      id: "",
      clockInTime: null,
      clockOutTime: null,
    },
  };

  const [modalValues, setModalValues] =
    useState<ModalValuesTypes>(modalnitialValues);

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
            {employeesAttendance.map((attendance: any, index: number) => {
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
                    {attendanceValues.attendance.clockIn
                      ? formatTime(attendanceValues.attendance.clockIn)
                      : "--"}
                  </TableCell>
                  <TableCell align="center">
                    {attendanceValues.attendance.clockOut
                      ? formatTime(attendanceValues.attendance.clockOut)
                      : "--"}
                  </TableCell>
                  <TableCell align="center">
                    {attendanceValues.attendance.duration}
                  </TableCell>
                  <TableCell align="center">
                    {attendanceValues.open ? (
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        gap={1}
                      >
                        {attendanceValues.status}

                        <EditOutlinedIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            setModalValues({
                              open: true,
                              attendance: {
                                id: attendanceValues.attendance.id,
                                clockInTime:
                                  new Date(
                                    attendanceValues.attendance.clockIn
                                  ) || null,
                                clockOutTime: attendanceValues.attendance
                                  .clockOut
                                  ? new Date(
                                      attendanceValues.attendance.clockOut
                                    )
                                  : null,
                              },
                            })
                          }
                        />
                      </Stack>
                    ) : (
                      attendanceValues.status
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {modalValues.open && (
        <EditAttendanceModal
          attendanceValues={modalValues.attendance}
          modal={modalValues.open}
          onCancel={() => {
            setModalValues(modalnitialValues);
          }}
          onConfirm={handleEditAttendance}
        />
      )}
    </Paper>
  );
};
