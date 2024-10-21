import {
  Card,
  CardHeader,
  Stack,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  CircularProgress,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Scrollbar } from "src/utils/scrollbar";
import { styled } from "@mui/material/styles";
import { leavesApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import UpdateLeavesStatus from "../leaves-status";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";

export const LeavesCard = ({
  employeeId,
  cardHeight,
}: {
  employeeId: string | any;
  cardHeight: number;
}) => {
  const [leavesList, setLeavesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth<AuthContextType>();

  const getLeaves = useCallback(async () => {
    setIsLoading(true);
    if (!employeeId) return;
    let response = await leavesApi.getUserLeaves(employeeId, new Date());

    setLeavesList(response);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  const handleUpdateStatus = async (leave_id: string, status: string) => {
    await leavesApi.updateLeaveStatus({ leave_id, status });
    setLeavesList((prevList) =>
      prevList.map((leave) =>
        leave._id === leave_id ? { ...leave, status } : leave
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "approved":
        return <CheckCircleIcon fontSize="small" />;
      case "rejected":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

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

  const calculateLeaveDays = (startDate: Date, endDate: Date): string => {
    const start = new Date(startDate).getTime(); // Convert to timestamp
    const end = new Date(endDate).getTime(); // Convert to timestamp

    // Calculate the difference in milliseconds
    const diffTime = Math.abs(end - start);

    // Convert the difference to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates

    // Return the number of days as a string with the correct pluralization
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <Card sx={{ height: cardHeight }}>
      <CardHeader title="Leaves" />
      <Scrollbar sx={{ maxHeight: 400, overflowY: "auto" }}>
        <CardContent>
          <Stepper orientation="vertical">
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={360}
              >
                <CircularProgress />
              </Box>
            ) : !leavesList.length ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <Typography variant="h6" textAlign="center">
                  No Leaves Found
                </Typography>
              </Box>
            ) : (
              leavesList.map((leave) => (
                <Step key={leave.id} active={true}>
                  <StepLabel
                    StepIconComponent={() => (
                      <StatusIcon status={leave.status.toLowerCase()}>
                        {getStatusIcon(leave.status)}
                      </StatusIcon>
                    )}
                  >
                    <Typography variant="subtitle1">{`${formatDate(
                      leave.startDate,
                      "D MMM YYYY"
                    )} - ${formatDate(
                      leave.endDate,
                      "D MMM YYYY"
                    )}`}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textTransform={"capitalize"}
                        >
                          {leave.leave_type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {calculateLeaveDays(leave.startDate, leave.endDate)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            leave.status === "approved"
                              ? "success.main"
                              : leave.status === "rejected"
                              ? "error.main"
                              : "warning.main"
                          }
                          fontWeight="bold"
                          textTransform={"capitalize"}
                        >
                          {leave.status}
                        </Typography>
                      </Box>
                      {(user?.role === ROLES.Admin ||
                        user?.role === ROLES.HR) && (
                        <UpdateLeavesStatus
                          handleUpdateStatus={handleUpdateStatus}
                          leaveId={leave._id}
                          leaveStatus={leave.status}
                        />
                      )}
                    </Stack>
                  </StepContent>
                </Step>
              ))
            )}
          </Stepper>
        </CardContent>
      </Scrollbar>
    </Card>
  );
};
