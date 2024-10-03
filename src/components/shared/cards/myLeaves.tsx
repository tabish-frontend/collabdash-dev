import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Link,
  styled,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import { Scrollbar } from "src/utils/scrollbar";

interface Leave {
  id: number;
  dateRange: string;
  reason: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
}

const leaves: Leave[] = [
  {
    id: 1,
    dateRange: "29 September 2023 - 30 September 2023",
    reason: "Leaving for Meeting",
    days: 2,
    status: "Pending",
  },
  {
    id: 2,
    dateRange: "5 September 2023",
    reason: "Teacher's day speaking at my old high-school",
    days: 1,
    status: "Approved",
  },
  {
    id: 3,
    dateRange: "4 September 2023",
    reason: "Travelling for teachers dat at high school",
    days: 1,
    status: "Rejected",
  },
  {
    id: 4,
    dateRange: "24 August 2023 - 26 August 2023",
    reason: "Doctor Appointment",
    days: 3,
    status: "Approved",
  },
  {
    id: 5,
    dateRange: "10 August 2023",
    reason: "Birthday!",
    days: 1,
    status: "Approved",
  },
];

const StatusIcon = styled(Box)<{ status: string }>(({ theme, status }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor:
    status === "Approved"
      ? theme.palette.success.main
      : status === "Rejected"
      ? theme.palette.error.main
      : theme.palette.warning.main,
  color: theme.palette.common.white,
}));

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <PendingIcon fontSize="small" />;
    case "Approved":
      return <CheckCircleIcon fontSize="small" />;
    case "Rejected":
      return <CancelIcon fontSize="small" />;
    default:
      return null;
  }
};

export const MyLeavesCard: React.FC = () => {
  return (
    <Card sx={{ height: 490 }}>
      <CardHeader
        title="My Leaves"
        action={
          <Button color="primary" variant="contained" size="small">
            Apply for Leaves
          </Button>
        }
      />
      <Scrollbar sx={{ maxHeight: 400, overflowY: "auto" }}>
        <CardContent>
          <Stepper orientation="vertical">
            {leaves.map((leave) => (
              <Step key={leave.id} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <StatusIcon status={leave.status.toLowerCase()}>
                      {getStatusIcon(leave.status)}
                    </StatusIcon>
                  )}
                >
                  <Typography variant="subtitle1">{leave.dateRange}</Typography>
                </StepLabel>
                <StepContent>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {leave.reason}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {leave.days} day{leave.days > 1 ? "s" : ""}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        leave.status === "Approved"
                          ? "success.main"
                          : leave.status === "Rejected"
                          ? "error.main"
                          : "warning.main"
                      }
                      fontWeight="bold"
                    >
                      {leave.status}
                    </Typography>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Scrollbar>
    </Card>
  );
};

export default MyLeavesCard;
