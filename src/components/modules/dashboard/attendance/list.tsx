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
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MuiTab, { TabProps } from "@mui/material/Tab";
import { AllUserAttendance } from "./tabs/all-user-attendance";
import { MyAttendance } from "./tabs/my-attendance";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { AccountOutline, LockOpenOutline } from "mdi-material-ui";

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

  const [filters, setFilters] = useState({
    month: 5,
    year: 2024,
  });

  const [tabValue, setTabValue] = useState<string | string[]>(
    user?.role === ROLES.Employee ? "my_attendance" : "employee_attendance"
  );

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const settings = useSettings();

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
          <Box>
            <Typography variant="h4">Attendance</Typography>
          </Box>

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
                  <AllUserAttendance filters={filters} />
                </TabPanel>

                <TabPanel sx={{ p: 0 }} value="my_attendance">
                  <MyAttendance filters={filters} />
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
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
