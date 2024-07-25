import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ImageAvatar, RouterLink } from "src/components/shared";
import { Scrollbar } from "src/utils/scrollbar";
import { paths } from "src/constants/paths";
import { CellValues } from "../helper";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { EditAttendanceModal } from "./edit-attendance";
import { useDialog } from "src/hooks";

interface ModalValuesTypes {
  id: string;
  clockInTime: null | Date;
  clockOutTime: null | Date;
}

export const MonthViewAttendance = ({
  employeesAttendance,
  filters,
  handleEditAttendance,
}: any) => {
  const daysInMonth = dayjs(filters.date).daysInMonth();
  const theme = useTheme();

  const EditAttendanceDialog = useDialog<{ values: ModalValuesTypes }>();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const today = dayjs();
  const todayDate = today.date();
  const todayMonth = today.month();
  const todayYear = today.year();

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const scrollToToday = () => {
      if (scrollRef.current) {
        const scrollElement = scrollRef.current.getScrollElement();
        const todayColumn = document.getElementById("today-column");
        if (todayColumn && scrollElement) {
          scrollElement.scrollLeft =
            todayColumn.offsetLeft - scrollElement.offsetLeft;
        }
      }
    };
    scrollToToday();
  }, []);

  return (
    <Paper sx={{ overflowX: "auto" }}>
      <TableContainer>
        <Scrollbar ref={scrollRef} sx={{ maxHeight: 470 }}>
          <Table>
            <TableHead sx={{ borderBottom: 1 }}>
              <TableRow>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                  }}
                >
                  Employee
                </TableCell>
                {[...Array(daysInMonth)].map((_, index) => {
                  const cellDate = dayjs(filters.date).set("date", index + 1);
                  const isToday =
                    cellDate.date() === todayDate &&
                    cellDate.month() === todayMonth &&
                    cellDate.year() === todayYear;

                  return (
                    <TableCell
                      key={`header-${index + 1}`}
                      id={isToday ? "today-column" : undefined}
                      sx={{
                        backgroundColor: isToday
                          ? theme.palette.mode === "dark"
                            ? "HighlightText !important"
                            : `${theme.palette.info.alpha50} !important`
                          : "inherit",
                      }}
                    >
                      <Typography variant="caption">{index + 1}</Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {employeesAttendance.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      p: 1,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Stack
                      direction={"row"}
                      component={RouterLink}
                      color="inherit"
                      href={`${paths.employees}/${item.username}`}
                      gap={1}
                      width={isSmallScreen ? 80 : 150}
                      alignItems={"center"}
                    >
                      <Tooltip title={item.full_name} arrow>
                        <span>
                          <ImageAvatar
                            path={item.avatar || ""}
                            alt="user image"
                            width={30}
                            height={30}
                          />
                        </span>
                      </Tooltip>

                      {!isSmallScreen && item.full_name}
                    </Stack>
                  </TableCell>

                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const date = dayjs(filters.date).set("date", dayIndex + 1);
                    const isToday =
                      date.date() === todayDate &&
                      date.month() === todayMonth &&
                      date.year() === todayYear;

                    const attendanceValues = CellValues(item, date.toDate());

                    return (
                      <TableCell
                        key={`attendance-${index}-${dayIndex}`}
                        sx={{
                          p: 0,
                          cursor: "pointer",
                          backgroundColor: isToday
                            ? theme.palette.mode === "dark"
                              ? "HighlightText"
                              : theme.palette.info.alpha50
                            : "inherit",
                        }}
                        align="center"
                        onClick={() =>
                          attendanceValues?.open &&
                          EditAttendanceDialog.handleOpen({
                            values: {
                              id: attendanceValues.attendance.id,
                              clockInTime:
                                new Date(attendanceValues.attendance.clockIn) ||
                                null,
                              clockOutTime: attendanceValues.attendance.clockOut
                                ? new Date(attendanceValues.attendance.clockOut)
                                : null,
                            },
                          })
                        }
                      >
                        <Tooltip title={attendanceValues?.tooltip} arrow>
                          <span>{attendanceValues.icon}</span>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {EditAttendanceDialog.open && (
        <EditAttendanceModal
          attendanceValues={EditAttendanceDialog.data?.values}
          modal={EditAttendanceDialog.open}
          onCancel={EditAttendanceDialog.handleClose}
          onConfirm={handleEditAttendance}
        />
      )}
    </Paper>
  );
};
