// ** React Imports
import { Fragment, useCallback, useEffect, useState } from "react";

import { Skeleton, Stack, Typography } from "@mui/material";

import { attendanceApi } from "src/api";
import { NoRecordFound, SelectMultipleUsers } from "src/components/shared";

import { DayViewAttendance } from "../attendanceView/dayView";
import { MonthViewAttendance } from "../attendanceView/monthView";
import { React } from "mdi-material-ui";
import { statusMapping } from "src/constants/attendance-status";
import { useRouter } from "next/router";

interface AllUserAttendanceProps {
  filters: any;
}

export const AllUserAttendance: React.FC<AllUserAttendanceProps> = ({
  filters,
}) => {
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
};
