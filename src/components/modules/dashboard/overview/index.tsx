import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts";
import {
  WelcomeCard,
  PerformanceCard,
  TimeLogCard,
  EmployeesAvailability,
  TotalEmployees,
  AttendanceCard,
  TopPerformers,
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
            <PerformanceCard />
          </Grid>

          <Grid xs={12} md={4} lg={4}>
            <TimeLogCard />
          </Grid>

          {(user?.role === "admin" || user?.role === "hr") && (
            <>
              <Grid xs={12} md={4} lg={4}>
                <EmployeesAvailability />
              </Grid>

              <Grid xs={12} md={4} lg={4}>
                <TotalEmployees />
              </Grid>

              <Grid xs={12}>
                <AttendanceCard />
              </Grid>

              {/* <Grid xs={12}>
                <TopPerformers />
              </Grid> */}
            </>
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
