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
import {
  Button,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useEffect, useState } from "react";
import {
  calculateWorkingPercentage,
  formatDuration,
  formatTime,
} from "src/utils/helpers";
import { ConfirmationModal } from "../modals";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import ReactApexChart from "react-apexcharts";
import { Chart } from "../charts/style";

export const TimeLogCard = () => {
  const theme = useTheme();

  const { attendance, updateAttendanceLog } = useAuth<AuthContextType>();

  const [percentageWorked, setPercentageWorked] = useState<number>(0);
  const [clockOutModal, setClockOutModal] = useState(false);

  useEffect(() => {
    if (attendance) {
      setPercentageWorked(
        calculateWorkingPercentage(
          attendance.timeIn,
          attendance.timeOut,
          attendance.breaks
        )
      );
    }
  }, [attendance]);

  const handleTimeLog = async (action: string) => {
    await updateAttendanceLog(action);
  };

  const isOnBreak =
    attendance?.breaks?.length > 0 &&
    !attendance.breaks[attendance.breaks.length - 1].end;

  const completedBreaksCount =
    attendance?.breaks?.filter((breakItem: any) => breakItem.end).length || 0;

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
            label: isOnBreak ? "Break" : "Working",
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
        <CardHeader title="Attendance" />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {!attendance?.timeOut && (
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
                )}

                {attendance && (
                  <Typography variant="body1">
                    ClockIn: {attendance && formatTime(attendance?.timeIn)}
                  </Typography>
                )}

                {attendance && attendance.timeOut !== null && (
                  <Typography variant="body1">
                    ClockOut:
                    {attendance && formatTime(attendance?.timeOut)}
                  </Typography>
                )}

                {attendance && attendance.duration !== 0 && (
                  <Typography variant="body1">
                    {`Duration: ${formatDuration(attendance.duration)}`}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={3} mt={2}>
                {!attendance?.timeOut && (
                  <Tooltip
                    arrow
                    placement="left"
                    title={
                      completedBreaksCount >= 3
                        ? "You are allowed only 3 breaks per day"
                        : ""
                    }
                  >
                    <span>
                      <Button
                        variant="contained"
                        color={isOnBreak ? "success" : "info"}
                        onClick={() =>
                          handleTimeLog(isOnBreak ? "resume" : "break")
                        }
                        disabled={completedBreaksCount >= 3} // Disable if 3 breaks are completed
                      >
                        {isOnBreak ? "Resume" : "Break"}
                      </Button>
                    </span>
                  </Tooltip>
                )}

                {attendance?.breaks.length > 0 && (
                  <>
                    <Typography variant="h6">Breaks</Typography>

                    {attendance.breaks.map((breakItem: any, index: number) => (
                      <Stack direction={"row"} spacing={2} key={index}>
                        <Typography variant="subtitle2">
                          {index + 1}.
                        </Typography>
                        <Typography variant="caption">
                          {`Start : ${formatTime(breakItem.start)}`}
                        </Typography>
                        <Typography variant="caption">
                          {`End : ${
                            breakItem.end
                              ? formatTime(breakItem.end)
                              : "Ongoing"
                          }`}
                        </Typography>
                        <Typography variant="caption">
                          {`Duration : ${
                            breakItem.end
                              ? formatDuration(breakItem.duration)
                              : "Ongoing"
                          }`}
                        </Typography>
                      </Stack>
                    ))}
                  </>
                )}
              </Stack>
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
