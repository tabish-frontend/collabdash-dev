/* eslint-disable */

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  styled,
  Box,
  Container,
  Stack,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MuiTab, { TabProps } from "@mui/material/Tab";
import { AllUserAttendance } from "./tabs/all-user-attendance";
import { MyAttendance } from "./tabs/my-attendance";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { monthOptions } from "src/constants/month-names";
import { attendanceFormat } from "src/constants/attendance-format";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountOutline, LockOpenOutline } from "mdi-material-ui";
import { DayWiseUserAttendance } from "./tabs/daywise-user-attendance";
import { Employee, Holiday } from "src/types";
import { employeesApi } from "src/api";
import {
  SelectMultipleDepartments,
  SelectMultipleUsers,
} from "src/components/shared";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AttendanceListComponent = () => {
  const { user } = useAuth<AuthContextType>();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<{
    type: string;
    date: Date | null;
    month: number;
    year: number;
  }>({
    type: "month",
    date: null,
    month: currentMonth + 1,
    year: currentYear,
  });

  useEffect(() => {
    console.log("filters", filters);
  }, [filters]);

  const [tabValue, setTabValue] = useState<string | string[]>(
    user?.role === ROLES.Employee ? "my_attendance" : "employee_attendance"
  );

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleDateChange = (date: any) => {
    setFilters((prev) => ({ ...prev, date }));
  };

  const settings = useSettings();

  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees(
      "full_name,avatar,department"
    );
    setEmployees(response.users);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

  useEffect(() => {
    console.log(selectedUsers)
  }, [selectedUsers])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Stack direction={"row"} justifyContent="space-between">
            <Box>
              <Typography variant="h4">Attendance</Typography>
            </Box>
            <Stack direction={"row"} spacing={2}>
              
                <SelectMultipleUsers
                  employees={
                    departments.length
                      ? employees.filter((employee) =>
                          departments.includes(employee.department)
                        )
                      : employees
                  }
                  formikUsers={selectedUsers}
                  setFieldValue={(value: any) => setSelectedUsers(value)}
                />
             

              <TextField
                select
                label="Select Type"
                sx={{ width: "200px" }}
                value={filters.type}
                onChange={(e) =>
                  e.target.value === "day"
                    ? setFilters((prev) => ({
                        ...prev,
                        type: e.target.value,
                        month: 0,
                        year: 0,
                        date: new Date(),
                      }))
                    : setFilters((prev) => ({
                        ...prev,
                        type: e.target.value,
                        month: currentMonth + 1,
                        year: currentYear,
                        date: null,
                      }))
                }
              >
                {attendanceFormat.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {filters.type === "month" ? (
                <TextField
                  select
                  label="Select Month"
                  sx={{ width: "200px" }}
                  value={filters.month}
                  // onChange={(e) => setSecondSelectValue(e.target.value as string)}
                  onChange={(e: any) =>
                    setFilters((prev) => ({ ...prev, month: e.target.value }))
                  }
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: "200px",
                        },
                      },
                    },
                  }}
                >
                  {monthOptions.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <DatePicker
                  value={filters.date}
                  label="Select Date"
                  sx={{ width: 200 }}
                  onChange={handleDateChange}
                />
              )}
            </Stack>
          </Stack>

          <Stack>
            <Card>
              <CardContent>
                <TabContext value={tabValue as string}>
                  {user?.role === ROLES.HR && (
                    <TabList
                      onChange={handleChange}
                      aria-label="account-settings tabs"
                      sx={{
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Tab
                        value="employee_attendance"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccountOutline />
                            <TabName>Employees Attendance</TabName>
                          </Box>
                        }
                      />
                      <Tab
                        value="my_attendance"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LockOpenOutline />
                            <TabName>My Attendance</TabName>
                          </Box>
                        }
                      />
                    </TabList>
                  )}

                  <TabPanel sx={{ p: 0 }} value="employee_attendance">
                    {filters.type === "month" ? (
                      <AllUserAttendance filters={filters} selectedUsers={selectedUsers} />
                    ) : (
                      <DayWiseUserAttendance filters={filters} />
                    )}
                  </TabPanel>

                  <TabPanel sx={{ p: 0 }} value="my_attendance">
                    <MyAttendance filters={filters} />
                  </TabPanel>
                </TabContext>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </Box>
    // <Grid container spacing={6}>
    //   <Grid item xs={12} mb={3}>
    //     <Typography variant="h4" color={"#9155FD"}>
    //       Attendance List
    //     </Typography>
    //   </Grid>
    //   <Grid item xs={12}>
    //     <TabContext value={tabValue as string}>
    //       {user?.role === ROLES.HR && (
    //         <TabList
    //           onChange={handleChange}
    //           aria-label="account-settings tabs"
    //           sx={{
    //             borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    //           }}
    //         >
    //           <Tab
    //             value="employee_attendance"
    //             label={
    //               <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <AccountOutline />
    //                 <TabName>Employees Attendance</TabName>
    //               </Box>
    //             }
    //           />
    //           <Tab
    //             value="my_attendance"
    //             label={
    //               <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <LockOpenOutline />
    //                 <TabName>My Attendance</TabName>
    //               </Box>
    //             }
    //           />
    //         </TabList>
    //       )}

    //       <TabPanel sx={{ p: 0 }} value="employee_attendance">
    //         <AllUserAttendance filters={filters} />
    //       </TabPanel>

    //       <TabPanel sx={{ p: 0 }} value="my_attendance">
    //         <MyAttendance filters={filters} />
    //       </TabPanel>
    //     </TabContext>
    //   </Grid>
    // </Grid>
  );
};

const AttendanceList: NextPage = () => {
  return <AttendanceListComponent />;
};

AttendanceList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { AttendanceList };
