// ** React Imports
import { Fragment, useCallback, useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import { attendanceApi } from "src/api";
import { SelectMultipleUsers } from "src/components/shared";

import { DayWiseUserAttendance } from "../attendanceView/dayView";
import { MonthViewAttendance } from "../attendanceView/monthView";
import { React } from "mdi-material-ui";
import { statusMapping } from "src/constants/attendance-status";

interface AllUserAttendanceProps {
  filters: any;
}

export const AllUserAttendance: React.FC<AllUserAttendanceProps> = ({
  filters,
}) => {
  const [employees, setEmployees] = useState<any[] | []>([]);
  const [employeesAttendance, setEmployeesAttendance] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const handleGetAttendances = useCallback(async () => {
    const response = await attendanceApi.getAllUserAttendance(filters);
    setEmployees(response.data);
    let filteredEmployees = response.data;

    if (selectedUsers.length > 0) {
      filteredEmployees = filteredEmployees.filter((employee: any) =>
        selectedUsers.includes(employee._id)
      );
    }

    setEmployeesAttendance(filteredEmployees);
  }, [filters, selectedUsers]);

  useEffect(() => {
    handleGetAttendances();
  }, [handleGetAttendances]);

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
        {filters.month ? (
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
          <div>
          </div>
        )}

        <SelectMultipleUsers
          employees={employees}
          formikUsers={selectedUsers}
          setFieldValue={(value: any) => setSelectedUsers(value)}
        />
      </Stack>

      {filters.view === "month" ? (
        <MonthViewAttendance
          employeesAttendance={employeesAttendance}
          filters={filters}
        />
      ) : (
        <DayWiseUserAttendance
          employeesAttendance={employeesAttendance}
          filters={filters}
        />
      )}
    </>
  );
};
