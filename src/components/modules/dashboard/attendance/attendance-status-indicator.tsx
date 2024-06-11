import React from "react";
import { Box, Typography } from "@mui/material";
import {
  CheckCircleOutline,
  ClockTimeThreeOutline,
  CloseCircleOutline,
  TimerSandEmpty,
} from "mdi-material-ui";

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

export const headerStatus = [
  {
    title: "Full Day Presnt",
    icon: <CheckCircleOutline sx={{ fontSize: 16 }} color="success" />,
  },
  {
    title: "Half Day Presnt",
    icon: <ClockTimeThreeOutline sx={{ fontSize: 16 }} color="warning" />,
  },
  {
    title: "Full Day Absent",
    icon: <CloseCircleOutline sx={{ fontSize: 16 }} color="error" />,
  },
  {
    title: "Short Attendance",
    icon: <TimerSandEmpty sx={{ fontSize: 16 }} color="success" />,
  },
  {
    title: "On Leave",
    icon: <StatusIndicator status="Leave" />,
  },
  {
    title: "Holiday",
    icon: <StatusIndicator status="Holiday" />,
  },
  {
    title: "Weekend",
    icon: <StatusIndicator status="Weekend" />,
  },
  {
    title: "Online",
    icon: <Box width={6} height={6} borderRadius="50%" bgcolor={"green"} />,
  },
];
