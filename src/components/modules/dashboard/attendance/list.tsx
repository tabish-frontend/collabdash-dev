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
  IconButton,
  SvgIcon,
} from "@mui/material";
import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MuiTab, { TabProps } from "@mui/material/Tab";
import { AllUserAttendance } from "./tabs/all-user-attendance";
import { MyAttendance } from "./tabs/my-attendance";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { getMonthLabel, monthOptions } from "src/constants/month-names";
import { attendanceFormat } from "src/constants/attendance-format";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  AccountOutline,
  ChevronLeft,
  ChevronRight,
  LockOpenOutline,
} from "mdi-material-ui";
import { DayWiseUserAttendance } from "./tabs/daywise-user-attendance";
import { getLocalFormattedDate } from "src/utils";

interface FiltersType {
  view: string;
  date: Date | null;
  month: number;
  year: number;
}

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

  const [filters, setFilters] = useState<FiltersType>({
    view: "month",
    date: null,
    month: currentMonth + 1,
    year: currentYear,
  });

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

  const handleViewChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      e.target.value === "day"
        ? setFilters((prev) => ({
            ...prev,
            view: e.target.value,
            month: 0,
            year: 0,
            date: new Date(),
          }))
        : setFilters((prev) => ({
            ...prev,
            view: e.target.value,
            month: currentMonth + 1,
            year: currentYear,
            date: null,
          }));
    },
    [filters]
  );

  useEffect(() => {
    console.log("Filters", filters.date);
  }, [filters]);

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
          <Typography variant="h4">Attendance</Typography>

          <Stack
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            sx={{ px: 3 }}
          >
            {filters.view === "month" ? (
              <Typography variant="h5">{`${getMonthLabel(filters.month)} ${
                filters.year
              }`}</Typography>
            ) : (
              <Typography variant="h5">
                {getLocalFormattedDate(filters.date)}
              </Typography>
            )}

            <Stack alignItems="center" direction="row" spacing={1}>
              <IconButton
                onClick={() =>
                  setFilters((prev) => ({ ...prev, month: filters.month - 1 }))
                }
              >
                <SvgIcon>
                  <ChevronLeft />
                </SvgIcon>
              </IconButton>

              <IconButton
                onClick={() =>
                  setFilters((prev) => ({ ...prev, month: filters.month + 1 }))
                }
              >
                <SvgIcon>
                  <ChevronRight />
                </SvgIcon>
              </IconButton>

              <TextField
                label="View"
                name="view"
                onChange={handleViewChange}
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "150px",
                      },
                    },
                  },
                }}
                size="small"
                sx={{
                  minWidth: 150,
                }}
                value={filters.view}
              >
                {attendanceFormat.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {filters.view === "month" ? (
                <TextField
                  select
                  label="Select Month"
                  value={filters.month}
                  size="small"
                  sx={{
                    minWidth: 150,
                  }}
                  onChange={(e: any) =>
                    setFilters((prev) => ({ ...prev, month: e.target.value }))
                  }
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: "150px",
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
                  sx={{ width: 150 }}
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
                    {filters.view === "month" ? (
                      <AllUserAttendance filters={filters} />
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
  );
};

const AttendanceList: NextPage = () => {
  return <AttendanceListComponent />;
};

AttendanceList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { AttendanceList };
