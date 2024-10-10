import {
  styled,
  Box,
  Container,
  Stack,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  SvgIcon,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { AllUserAttendance } from "./tabs/all-user-attendance";
import { MyAttendance } from "./tabs/my-attendance";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ChevronLeft, ChevronRight } from "mdi-material-ui";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { DateView } from "@mui/x-date-pickers";
import { attendanceApi } from "src/api";
import { downloadAttendanceSheet } from "./download-attendance";

interface FiltersType {
  view: string;
  date: Date | null;
}

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const TabStatus = [
  {
    label: "Employees Attendance",
    value: "employee_attendance",
    roles: ["admin", "hr"], // Accessible by admin and HR
  },
  {
    label: "My Attendance",
    value: "my_attendance",
    roles: ["employee", "hr", "admin"], // Accessible by employees and HR
  },
];

const AttendanceListComponent = () => {
  const settings = useSettings();
  const router = useRouter();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { date: queryDate } = router.query;
  const { user } = useAuth<AuthContextType>();

  const initialDate = queryDate ? new Date(queryDate as string) : currentDate;

  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersType>({
    view: "month",
    date: initialDate,
  });

  const [tabValue, setTabValue] = useState<string | string[]>(
    user?.role === ROLES.Employee ? "my_attendance" : "employee_attendance"
  );

  const [employees, setEmployees] = useState();

  const GetAllUserWithAttendance = useCallback(async () => {
    setIsLoading(true);
    const response = await attendanceApi.getAllUserAttendance(filters);
    setEmployees(response.data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    if (tabValue === "employee_attendance") {
      GetAllUserWithAttendance();
    }
  }, [GetAllUserWithAttendance, tabValue]);

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleNext = () => {
    setFilters((prev) => {
      if (prev.view === "month") {
        const newDate = dayjs(prev.date).add(1, "month").toDate();
        return { ...prev, date: newDate };
      } else {
        const newDate = dayjs(prev.date).add(1, "day").toDate();
        return { ...prev, date: newDate };
      }
    });
  };

  const handlePrevious = () => {
    setFilters((prev) => {
      if (prev.view === "month") {
        const newDate = dayjs(prev.date).subtract(1, "month").toDate();
        return { ...prev, date: newDate };
      } else {
        const newDate = dayjs(prev.date).subtract(1, "day").toDate();
        return { ...prev, date: newDate };
      }
    });
  };

  const getLocalFormattedDate = (filters: any) => {
    if (filters.view === "day") {
      return dayjs(filters.date).format("DD MMMM YYYY");
    } else {
      return dayjs(filters.date).format("MMM YYYY");
    }
  };

  const getPickerConfig = () => {
    if (filters.view === "month") {
      return {
        DatePickerLabel: "Select Month",
        DatePickerViews: ["year", "month"] as DateView[],
      };
    } else {
      return {
        DatePickerLabel: "Select Date",
        DatePickerViews: ["year", "month", "day"] as DateView[],
      };
    }
  };

  const { DatePickerLabel, DatePickerViews } = getPickerConfig();

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
          <Typography variant="h4" lineHeight={1}>
            Attendance
          </Typography>

          <Stack
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            sx={{ px: 1, marginTop: "14px !important" }}
          >
            <Typography variant="h5">
              {getLocalFormattedDate(filters)}
            </Typography>

            <Stack
              alignItems="center"
              flexDirection={{
                xs: "column-reverse",
                md: "row",
              }}
              spacing={1}
            >
              <Stack direction={"row"}>
                <IconButton onClick={handlePrevious}>
                  <SvgIcon>
                    <ChevronLeft />
                  </SvgIcon>
                </IconButton>

                <IconButton onClick={handleNext}>
                  <SvgIcon>
                    <ChevronRight />
                  </SvgIcon>
                </IconButton>
              </Stack>

              <Stack direction={"row"} spacing={1}>
                <TextField
                  label="View"
                  name="view"
                  select
                  size="small"
                  value={filters.view}
                  sx={{
                    minWidth: 150,
                  }}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      date: new Date(),
                      view: e.target.value,
                    }))
                  }
                >
                  {["month", "day"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <DatePicker
                  key={filters.view}
                  value={filters.date}
                  label={DatePickerLabel}
                  views={DatePickerViews}
                  openTo={filters.view === "month" ? "month" : "day"}
                  minDate={new Date(currentYear - 3, 0, 1)}
                  maxDate={new Date(currentYear, 11, 31)}
                  sx={{ width: 180 }}
                  onChange={(date) => {
                    if (date) {
                      date.setHours(18, 0, 0, 0);
                      setFilters((prev) => ({ ...prev, date }));
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack>
            <Card>
              <CardContent>
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    width: "100%",
                    borderBottom: 1,
                    borderColor: "#ddd",
                    pb: 1,
                  }}
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    value={tabValue}
                  >
                    {TabStatus.filter((tab) =>
                      tab.roles.includes(user?.role || "")
                    ).map((tab) => (
                      <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                      />
                    ))}
                  </Tabs>

                  {(user?.role === ROLES.Admin || user?.role === ROLES.HR) &&
                    tabValue === "employee_attendance" && (
                      <Button
                        variant="contained"
                        size={isSmallScreen ? "small" : "medium"}
                        onClick={() =>
                          downloadAttendanceSheet(employees, filters)
                        }
                      >
                        Download CSV
                      </Button>
                    )}
                </Stack>

                {tabValue === "employee_attendance" ? (
                  <AllUserAttendance
                    filters={filters}
                    employees={employees}
                    isLoading={isLoading}
                  />
                ) : (
                  <MyAttendance filters={filters} />
                )}
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
