import {
  Link,
  Paper,
  Skeleton,
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
import {
  ImageAvatar,
  NoRecordFound,
  RouterLink,
  Scrollbar,
} from "src/components/shared";
import { paths } from "src/constants/paths";
import { CellValues } from "../helper";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { EditAttendanceModal } from "./edit-attendance";

interface ModalValuesTypes {
  open: boolean;
  attendance: {
    id: string;
    clockInTime: null | Date;
    clockOutTime: null | Date;
  };
}

export const MonthViewAttendance = ({
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

  const daysInMonth = dayjs(filters.date).daysInMonth();
  const theme = useTheme();
  const [modalValues, setModalValues] =
    useState<ModalValuesTypes>(modalnitialValues);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const today = dayjs();
  const todayDate = today.date();
  const todayMonth = today.month();
  const todayYear = today.year();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToToday = () => {
      if (scrollRef.current) {
        const todayColumn = document.getElementById("today-column");
        if (todayColumn) {
          scrollRef.current.scrollLeft =
            todayColumn.offsetLeft - scrollRef.current.offsetLeft;
        }
      }
    };
    scrollToToday();
  }, []);

  return (
    <Scrollbar sx={{ maxHeight: 600, overflowY: "auto" }}>
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto" }}
        ref={scrollRef}
      >
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
                        setModalValues({
                          open: true,
                          attendance: {
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
    </Scrollbar>
  );
};
