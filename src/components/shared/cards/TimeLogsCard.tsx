// ** React Imports

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

// import Typography from '@mui/material/Typography'
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports

import ClockInIcon from "mdi-material-ui/ClockCheckOutline";
import ClockOutIcon from "mdi-material-ui/ClockMinus";

// ** Types
import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";

import { useEffect, useState } from "react";
import { calculateWorkingPercentage, formatDuration } from "src/utils/helpers";
import { ConfirmationModal } from "../modals";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import ReactApexChart from "react-apexcharts";
import { Chart } from "../charts/style";

export const TimeLogCard = () => {
  const { attendance, updateAttendanceLog } = useAuth<AuthContextType>();

  const [percentageWorked, setPercentageWorked] = useState<number>(0);
  const [clockOutModal, setClockOutModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (attendance) {
      setPercentageWorked(
        calculateWorkingPercentage(attendance.timeIn, attendance.timeOut)
      );
    }
  }, [attendance]);

  const handleTimeLog = async (action: string) => {
    await updateAttendanceLog(action, {
      notes: "",
    });
  };

  const options = {
    plotOptions: {
      radialBar: {
        hollow: {
          size: "75%",
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            fontSize: "16px",
            fontWeight: 600,
          },
          value: {
            fontSize: "16px",
            color: theme.palette.text.primary,
          },
          total: {
            show: true,
            label: "Working",
            color: theme.palette.text.primary,
            formatter: () => `${percentageWorked.toFixed(2)}%`,
          },
        },
      },
    },
    colors: ["#804BDF"],
    labels: ["Progress"],
  };

  const series = [percentageWorked];

  return (
    <>
      <Card>
        <CardHeader
          title="Attendance"
          titleTypographyProps={{
            sx: { lineHeight: "1.2", letterSpacing: "0.31px" },
          }}
        />
        <CardContent sx={{ pt: theme.spacing(2) }}>
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Stack direction={"column"} spacing={2}>
                    {attendance && (
                      <Typography variant="body1" fontWeight={600}>
                        {`ClockIn: ${
                          attendance &&
                          new Date(attendance?.timeIn).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        }`}
                      </Typography>
                    )}

                    {attendance && attendance.timeOut !== null && (
                      <Typography variant="body1" fontWeight={600}>
                        {`ClockOut: ${
                          attendance &&
                          new Date(attendance?.timeOut).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        }`}
                      </Typography>
                    )}
                  </Stack>
                </Box>
                {!attendance ||
                attendance.timeIn === null ||
                attendance.timeOut === null ? (
                  <Button
                    variant="contained"
                    color={
                      attendance && attendance.timeIn ? "error" : "success"
                    }
                    startIcon={
                      attendance && attendance.timeIn ? (
                        <ClockOutIcon />
                      ) : (
                        <ClockInIcon />
                      )
                    }
                    onClick={() =>
                      attendance && attendance.timeIn
                        ? setClockOutModal(true)
                        : handleTimeLog("clockIn")
                    }
                  >
                    {attendance && attendance.timeIn ? "CHECK OUT" : "CHECK IN"}
                  </Button>
                ) : (
                  <Typography variant="body1">
                    {`Duration: ${formatDuration(
                      attendance.timeIn,
                      attendance.timeOut
                    )}`}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Chart
                options={options as any}
                series={[percentageWorked]}
                type="radialBar"
                height={280}
                key={series[0]}
              />
            </Box>
          </Grid>
        </CardContent>
      </Card>

      {clockOutModal && (
        <ConfirmationModal
          warning_title={"Clock Out"}
          warning_text={"Are you sure you want to Clock Out ?"}
          button_text={"Yes"}
          modal={clockOutModal}
          onCancel={() => {
            setClockOutModal(false);
          }}
          onConfirm={async () => {
            handleTimeLog("clockOut");
            setClockOutModal(false);
          }}
        />
      )}
    </>
  );
};
