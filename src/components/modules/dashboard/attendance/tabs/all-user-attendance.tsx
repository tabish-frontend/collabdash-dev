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
  employees: any;
  isLoading: boolean;
}

export const AllUserAttendance: React.FC<AllUserAttendanceProps> = ({
  filters,
  employees,
  isLoading,
}) => {
  const router = useRouter();
  const { user: queryUser } = router.query;

  const initialUser = queryUser ? [queryUser] : [];

  const [employeesAttendance, setEmployeesAttendance] = useState<any[]>();
  const [selectedUsers, setSelectedUsers] = useState<any[]>(initialUser);

  const handleFilterEmployees = useCallback(async () => {
    if (selectedUsers.length > 0) {
      const selectedEmployeeIds = selectedUsers.map((item) => item._id);
      const filteredEmployees = employees?.filter((employee: any) =>
        selectedEmployeeIds.includes(employee._id)
      );
      setEmployeesAttendance(filteredEmployees);
    } else {
      setEmployeesAttendance(employees);
    }
  }, [employees, selectedUsers]);

  useEffect(() => {
    handleFilterEmployees();
  }, [handleFilterEmployees]);

  const handleEditAttendance = async (editedValues: any) => {
    const { id, clockInTime, clockOutTime } = editedValues;

    const response = await attendanceApi.updateAttendance(id, {
      timeIn: clockInTime,
      timeOut: clockOutTime,
    });

    // Update the local state after the successful API call
    setEmployeesAttendance((prevState: any) =>
      prevState.map((employee: any) => ({
        ...employee,
        attendance: employee.attendance.map((att: any) =>
          att._id === id ? response.data : att
        ),
      }))
    );
  };

  useEffect(() => {
    setEmployeesAttendance(employees);
  }, [employees]);

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

        <SelectMultipleUsers
          employees={employees || []}
          // formikUsers={selectedUsers}
          formikUsers={selectedUsers.map((user: any) => user._id)}
          setFieldValue={(value: any) => setSelectedUsers(value)}
          minWidth="300px"
          label="Users"
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
      ) : employeesAttendance?.length === 0 ? (
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
