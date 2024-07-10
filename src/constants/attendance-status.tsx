import React from "react";
import {
  CheckCircleOutline,
  ClockTimeThreeOutline,
  CloseCircleOutline,
  TimerSandEmpty,
} from "mdi-material-ui";
import { Box, Typography } from "@mui/material";
import { amber } from '@mui/material/colors';

type StatusMapping = {
  [key: string]: {
    icon: JSX.Element;
    title: string;
  };
};

export const StatusIndicator = ({ status }: { status: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="2px solid #ddd"
      borderRadius="50%"
      width={17}
      height={17}
      mx={"auto"}
    >
      <Typography variant="caption" fontSize={10} fontWeight={600}>
        {status.charAt(0)}
      </Typography>
    </Box>
  );
};

export const statusMapping: StatusMapping = {
  short_attendance: {
    icon: <TimerSandEmpty sx={{ fontSize: 16 }} color="success" />,
    title: "Short Attendance",
  },
  full_day_absent: {
    icon: <CloseCircleOutline sx={{ fontSize: 16 }} color="error" />,
    title: "Full Day Absent",
  },
  half_day_present: {
    icon: <ClockTimeThreeOutline sx={{ fontSize: 16, color: amber[800] }}  />,
    title: "Half Day Present",
  },
  full_day_present: {
    icon: <CheckCircleOutline sx={{ fontSize: 16 }} color="success" />,
    title: "Full Day Present",
  },
  on_leave: {
    icon: <StatusIndicator status="Leave" />,
    title: "On Leave",
  },
  holiday: {
    icon: <StatusIndicator status="Holiday" />,
    title: "Holiday",
  },
  weekend: {
    icon: <StatusIndicator status="Weekend" />,
    title: "Weekend",
  },
  online: {
    icon: (
      <Box m={2.4} width={6} height={6} borderRadius="50%" bgcolor={"green"} />
    ),
    title: "Online",
  },
};
