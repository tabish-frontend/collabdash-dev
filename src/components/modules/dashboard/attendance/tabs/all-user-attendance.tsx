// ** React Imports
import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

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
import * as ExcelJS from "exceljs";

interface AllUserAttendanceProps {
  filters: any;
}

export const AllUserAttendance = forwardRef<unknown, AllUserAttendanceProps>(
  ({ filters }, ref) => {
    const router = useRouter();
    const { user: queryUser } = router.query;

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

    const exportAttendanceSheet = async (
      employeesAttendance: any,
      filters: any
    ) => {
      const selectedDate = dayjs(filters.date);
      const filterType = filters.view;
      const isCurrentMonth = selectedDate.isSame(dayjs(), "month");
      const monthStart = selectedDate.startOf("month");
      const monthEnd = isCurrentMonth ? dayjs() : selectedDate.endOf("month");
      const dayName = selectedDate.format("DD MMM YYYY");
      const monthName = selectedDate.format("MMMM YYYY");

      const workbook = new ExcelJS.Workbook();

      // Define styles with correct types
      const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, size: 14 },
        alignment: { horizontal: "center" as "center" },
      };

      const cellStyle: Partial<ExcelJS.Style> = {
        font: { size: 12 },
        alignment: { horizontal: "center" as "center" },
      };

      const statusStyles: { [key: string]: Partial<ExcelJS.Style> } = {
        Absent: { font: { color: { argb: "FFFF0000" }, size: 12 } }, // Red color for Absent
        "Full Day Present": { font: { color: { argb: "41ab46" }, size: 12 } }, // Dark Green color for Full Day Present
        "Half Day Present": { font: { color: { argb: "ff8f00" }, size: 12 } }, // Orange color for Half Day Present
        "Short Attendance": { font: { color: { argb: "debd47" }, size: 12 } }, // Yellow color for Half Day Present
        Online: { font: { color: { argb: "84fa69" }, size: 12 } }, // Light green color for Half Day Present
        // Add more styles as needed
      };

      const generateRow = (
        worksheet: ExcelJS.Worksheet,
        employee: any,
        date: Date
      ) => {
        const cellData = CellValues(employee, date);

        if (cellData.status === "Not Joined") return;

        worksheet
          .addRow([
            employee.full_name,
            dayjs(date).format("YYYY-MM-DD"),
            cellData.attendance.clockIn
              ? formatTime(cellData.attendance.clockIn)
              : "--",
            cellData.attendance.clockOut
              ? formatTime(cellData.attendance.clockOut)
              : "--",
            cellData.status,
            cellData.attendance.duration || "--",
          ])
          .eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === 5) {
              // Status column index
              const status = cell.value as string;
              if (status in statusStyles) {
                cell.style = { ...cellStyle, ...statusStyles[status] };
              } else {
                cell.style = cellStyle;
              }
            } else {
              cell.style = cellStyle;
            }
          });
      };

      employeesAttendance.forEach((employee: any) => {
        const worksheet = workbook.addWorksheet(employee.full_name);

        // Add headers
        worksheet
          .addRow([
            "Employee Name",
            "Date",
            "Time In",
            "Time Out",
            "Status",
            "Duration",
          ])
          .eachCell({ includeEmpty: true }, (cell) => {
            cell.style = headerStyle;
          });

        worksheet.addRow([]);

        if (filterType === "day") {
          generateRow(worksheet, employee, selectedDate.toDate());
        } else {
          const joinDate = dayjs(employee.join_date);
          const startDate = joinDate.isAfter(monthStart)
            ? joinDate
            : monthStart;

          for (let day = startDate.date(); day <= monthEnd.date(); day++) {
            generateRow(worksheet, employee, startDate.date(day).toDate());
          }
        }

        // Adjust column widths after adding data
        worksheet.columns.forEach((column) => {
          if (column && column.eachCell) {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
              const columnLength = cell.value
                ? cell.value.toString().length
                : 10;
              if (columnLength > maxLength) {
                maxLength = columnLength;
              }
            });
            column.width = maxLength + 8; // Add some extra space to each column
          }
        });
      });

      // Generate XLSX file and download
      const fileName =
        filterType === "day"
          ? `Attendance(${dayName}).xlsx`
          : `Attendance(${monthName}).xlsx`;

      await workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      });
    };

    const handleDownloadCsv = () => {
      exportAttendanceSheet(employeesAttendance, filters);
    };

    // Expose the download function to the parent component via ref
    useImperativeHandle(ref, () => ({
      downloadAttendanceCsv: handleDownloadCsv,
    }));

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
              {Object.entries(statusMapping).map(
                ([status, { title, icon }]) => {
                  return (
                    <Fragment key={status}>
                      {icon}
                      <Typography variant="caption">{title}</Typography>
                    </Fragment>
                  );
                }
              )}
            </Stack>
          ) : (
            <div></div>
          )}

          <SelectMultipleUsers
            employees={employees}
            formikUsers={selectedUsers}
            setFieldValue={(value: any) => setSelectedUsers(value)}
          />
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
  }
);
