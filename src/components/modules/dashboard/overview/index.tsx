import { Box, Card, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import {
  WelcomeCard,
  PerformanceCard,
  TimeLogCard,
  AttendanceCard,
  EmployeePerformanceCard,
  UpcomingMeetingsCard,
  TodoCard,
  WeatherCard,
  MyTasksCard,
  LeavesCard,
} from "src/components/shared";

const OverviewComponent = () => {
  const { user } = useAuth<AuthContextType>();

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
        <Grid
          container
          disableEqualOverflow
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Grid xs={12} md={4}>
            <WelcomeCard />
          </Grid>
          <Grid xs={12} md={8}>
            {user?.role === "admin" || user?.role === "hr" ? (
              <EmployeePerformanceCard />
            ) : (
              <PerformanceCard />
            )}
          </Grid>

          {user?.role !== "admin" && (
            <Grid xs={12} md={6} xl={4}>
              <TimeLogCard />
            </Grid>
          )}

          <Grid xs={12} md={6} xl={4}>
            <UpcomingMeetingsCard />
          </Grid>

          <Grid xs={12} md={6} xl={4}>
            <MyTasksCard userId={user?._id as string} />
          </Grid>
          <Grid xs={12} md={6} xl={4}>
            <TodoCard />
          </Grid>
          <Grid xs={12} md={6} xl={4} lg={user?.role === "admin" ? 6 : 6}>
            <LeavesCard employeeId={user?._id} cardHeight={490} />
          </Grid>
          <Grid xs={12} md={6} xl={4}>
            <WeatherCard name={"Weather"} />
          </Grid>

          {(user?.role === "admin" || user?.role === "hr") && (
            <Grid xs={12}>
              <AttendanceCard />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

const Overview: NextPage = () => {
  return <OverviewComponent />;
};

Overview.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Overview };
