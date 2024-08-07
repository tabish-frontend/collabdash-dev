// ** React Imports
import { Fragment, useCallback, useEffect, useState } from "react";

import {
  Button,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { attendanceApi } from "src/api";
import { NoRecordFound, SelectMultipleUsers } from "src/components/shared";

import { DayViewAttendance } from "../attendanceView/dayView";
import { MonthViewAttendance } from "../attendanceView/monthView";
import { React } from "mdi-material-ui";
import { statusMapping } from "src/constants/attendance-status";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { formatDuration, formatTime } from "src/utils";
import { CellValues } from "../helper";

interface AllUserAttendanceProps {
  filters: any;
}

export const AllUserAttendance: React.FC<AllUserAttendanceProps> = ({
  filters,
}) => {
  const router = useRouter();
  const { user: queryUser } = router.query;
  const theme = useTheme();

  const initialUser = queryUser ? [queryUser] : [];

  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<any[] | []>([]);
  const [employeesAttendance, setEmployeesAttendance] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>(initialUser);

  const handleGetAttendances = useCallback(async () => {
    setIsLoading(true);
    const response = await attendanceApi.getAllUserAttendance(filters);
    setEmployees(response.data);
    setEmployeesAttendance(response.data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    handleGetAttendances();
  }, [handleGetAttendances]);

  const handleFilterEmployees = useCallback(async () => {
    let filteredEmployees = employees;

    if (selectedUsers.length > 0) {
      filteredEmployees = filteredEmployees.filter((employee: any) =>
        selectedUsers.includes(employee._id)
      );
    }

    setEmployeesAttendance(filteredEmployees);
  }, [employees, selectedUsers]);

  useEffect(() => {
    handleFilterEmployees();
  }, [handleFilterEmployees]);

  const handleEditAttendance = async (editedValues: any) => {
    const { id, clockInTime, clockOutTime } = editedValues;
    await attendanceApi.updateAttendance(id, {
      timeIn: clockInTime,
      timeOut: clockOutTime,
    });
    handleGetAttendances();
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // const exportAttendanceSheet = (employeesAttendance: any, filters: any) => {
  //   const selectedDate = dayjs(filters.date);
  //   const isCurrentMonth = selectedDate.isSame(dayjs(), "month");
  //   const monthStart = selectedDate.startOf("month");
  //   const monthEnd = isCurrentMonth ? dayjs() : selectedDate.endOf("month");
  //   const monthName = selectedDate.format("MMMM YYYY");

  //   const csvData: string[] = [];
  //   const csvHeaders = [
  //     "Employee Name",
  //     "Date",
  //     "Time In",
  //     "Time Out",
  //     "Status",
  //     "Duration",
  //   ];
  //   csvData.push(csvHeaders.join(","));

  //   employeesAttendance.forEach((employee: any) => {
  //     const joinDate = dayjs(employee.join_date);
  //     const startDate = joinDate.isAfter(monthStart) ? joinDate : monthStart;

  //     for (let day = startDate.date(); day <= monthEnd.date(); day++) {
  //       const currentDay = startDate.date(day).toDate();
  //       const cellData = CellValues(employee, currentDay);

  //       // Skip the row if the status is "Not Joined"
  //       if (cellData.status === "Not Joined") continue;

  //       const row = [
  //         employee.full_name,
  //         dayjs(currentDay).format("YYYY-MM-DD"),
  //         cellData.attendance.clockIn
  //           ? formatTime(cellData.attendance.clockIn)
  //           : "--",
  //         cellData.attendance.clockOut
  //           ? formatTime(cellData.attendance.clockOut)
  //           : "--",
  //         cellData.status,
  //         cellData.attendance.duration || "--",
  //       ];
  //       csvData.push(row.join(","));
  //     }

  //     csvData.push("", "");
  //   });

  //   const csvString = csvData.join("\n");
  //   const blob = new Blob([csvString], { type: "text/csv" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `Attendance(${monthName}).csv`;
  //   link.click();
  // };

  const exportAttendanceSheet = (employeesAttendance: any, filters: any) => {
    const selectedDate = dayjs(filters.date);
    const filterType = filters.view; // Assuming filterType is either "day" or "month"
    const isCurrentMonth = selectedDate.isSame(dayjs(), "month");
    const monthStart = selectedDate.startOf("month");
    const monthEnd = isCurrentMonth ? dayjs() : selectedDate.endOf("month");
    const dayName = selectedDate.format("DD MMM YYYY");
    const monthName = selectedDate.format("MMMM YYYY");

    const csvData: string[] = [];
    const csvHeaders = [
      "Employee Name",
      "Date",
      "Time In",
      "Time Out",
      "Status",
      "Duration",
    ];
    csvData.push(csvHeaders.join(","));

    employeesAttendance.forEach((employee: any) => {
      // If filter is "day", only export the selected day's attendance
      if (filterType === "day") {
        const currentDay = selectedDate.toDate();
        const cellData = CellValues(employee, currentDay);

        if (cellData.status === "Not Joined") return;

        const row = [
          employee.full_name,
          dayjs(currentDay).format("YYYY-MM-DD"),
          cellData.attendance.clockIn
            ? formatTime(cellData.attendance.clockIn)
            : "--",
          cellData.attendance.clockOut
            ? formatTime(cellData.attendance.clockOut)
            : "--",
          cellData.status,
          cellData.attendance.duration || "--",
        ];
        csvData.push(row.join(","));

        csvData.push("");
      } else {
        // Existing logic for monthly export
        const joinDate = dayjs(employee.join_date);
        const startDate = joinDate.isAfter(monthStart) ? joinDate : monthStart;

        for (let day = startDate.date(); day <= monthEnd.date(); day++) {
          const currentDay = startDate.date(day).toDate();
          const cellData = CellValues(employee, currentDay);

          if (cellData.status === "Not Joined") continue;

          const row = [
            employee.full_name,
            dayjs(currentDay).format("YYYY-MM-DD"),
            cellData.attendance.clockIn
              ? formatTime(cellData.attendance.clockIn)
              : "--",
            cellData.attendance.clockOut
              ? formatTime(cellData.attendance.clockOut)
              : "--",
            cellData.status,
            cellData.attendance.duration || "--",
          ];
          csvData.push(row.join(","));
        }

        csvData.push("", "");
      }
    });

    const csvString = csvData.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      filterType === "day"
        ? `Attendance(${dayName}).csv`
        : `Attendance(${monthName}).csv`;
    link.click();
  };

  const handleDownloadCsv = () => {
    exportAttendanceSheet(employeesAttendance, filters);
  };

  return (
    <>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={1}
        gap={1}
        my={2}
        justifyContent={"space-between"}
      >
        {filters.view === "month" ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            {Object.entries(statusMapping).map(([status, { title, icon }]) => {
              return (
                <Fragment key={status}>
                  {icon}
                  <Typography variant="caption">{title}</Typography>
                </Fragment>
              );
            })}
          </Stack>
        ) : (
          <div></div>
        )}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent={"space-between"}
        >
          <Button
            variant="contained"
            size={isSmallScreen ? "small" : "medium"}
            onClick={handleDownloadCsv}
          >
            Download CSV
          </Button>

          <SelectMultipleUsers
            employees={employees}
            formikUsers={selectedUsers}
            setFieldValue={(value: any) => setSelectedUsers(value)}
          />
        </Stack>
      </Stack>

      {isLoading ? (
        <Stack height={300} mt={4}>
          {[...Array(7)].map((_, index) => (
            <Stack direction={"row"} spacing={1} key={`skeleton-${index}`}>
              <Skeleton
                variant="rounded"
                width={200}
                height={25}
                sx={{ mb: "10px" }}
              />
              <Skeleton variant="text" width={"100%"} height={25} />
            </Stack>
          ))}
        </Stack>
      ) : employeesAttendance.length === 0 ? (
        <NoRecordFound />
      ) : filters.view === "month" ? (
        <MonthViewAttendance
          employeesAttendance={employeesAttendance}
          filters={filters}
          handleEditAttendance={handleEditAttendance}
        />
      ) : (
        <DayViewAttendance
          employeesAttendance={employeesAttendance}
          filters={filters}
          handleEditAttendance={handleEditAttendance}
        />
      )}
    </>
  );
};
