import * as ExcelJS from "exceljs";
import { CellValues } from "./helper";
import { formatTime } from "src/utils";
import dayjs from "dayjs";

const getHeaderStyle = (): Partial<ExcelJS.Style> => ({
  font: { bold: true, size: 14 },
  alignment: { horizontal: "center" as "center" },
});

const getCellStyle = (): Partial<ExcelJS.Style> => ({
  font: { size: 12 },
  alignment: { horizontal: "center" as "center" },
});

const getStatusStyles = (): { [key: string]: Partial<ExcelJS.Style> } => ({
  Absent: { font: { color: { argb: "FFFF0000" }, size: 12 } },
  "Full Day Present": { font: { color: { argb: "41ab46" }, size: 12 } },
  "Half Day Present": { font: { color: { argb: "ff8f00" }, size: 12 } },
  "Short Attendance": { font: { color: { argb: "debd47" }, size: 12 } },
  Online: { font: { color: { argb: "84fa69" }, size: 12 } },
});

const generateRow = (
  worksheet: ExcelJS.Worksheet,
  employee: any,
  date: Date
) => {
  const cellData = CellValues(employee, date);

  if (cellData.status === "Not Joined") return;

  const statusStyles = getStatusStyles();
  const cellStyle = getCellStyle();

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
        const status = cell.value as string;
        cell.style =
          status in statusStyles
            ? { ...cellStyle, ...statusStyles[status] }
            : cellStyle;
      } else {
        cell.style = cellStyle;
      }
    });
};

const addHeaders = (worksheet: ExcelJS.Worksheet) => {
  const headerStyle = getHeaderStyle();
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

  worksheet.addRow([]); // Add an empty row for spacing
};

const adjustColumnWidths = (worksheet: ExcelJS.Worksheet) => {
  // Adjust column widths after adding data
  worksheet.columns.forEach((column) => {
    if (column && column.eachCell) {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 8; // Add some extra space to each column
    }
  });
};

export const downloadAttendanceSheet = async (employees: any, filters: any) => {
  const selectedDate = dayjs(filters.date);
  const filterType = filters.view;
  const isCurrentMonth = selectedDate.isSame(dayjs(), "month");
  const monthStart = selectedDate.startOf("month");
  const monthEnd = isCurrentMonth ? dayjs() : selectedDate.endOf("month");
  const dayName = selectedDate.format("DD MMM YYYY");
  const monthName = selectedDate.format("MMMM YYYY");

  const workbook = new ExcelJS.Workbook();

  employees.forEach((employee: any) => {
    const worksheet = workbook.addWorksheet(employee.full_name);

    addHeaders(worksheet);

    if (filterType === "day") {
      generateRow(worksheet, employee, selectedDate.toDate());
    } else {
      const joinDate = dayjs(employee.join_date);
      const startDate = joinDate.isAfter(monthStart) ? joinDate : monthStart;

      for (let day = startDate.date(); day <= monthEnd.date(); day++) {
        generateRow(worksheet, employee, startDate.date(day).toDate());
      }
    }

    adjustColumnWidths(worksheet);
  });

  // Generate XLSX file and download
  const fileName =
    filterType === "day"
      ? `Attendance(${dayName}).xlsx`
      : `Attendance(${monthName}).xlsx`;

  await workbook.xlsx.writeBuffer().then((buffer: BlobPart) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
};
