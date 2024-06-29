// ** MUI Imports
import { useRouter } from "next/router";
// ** Types Imports
import {
  Paper,
  TableBody,
  TableCell,
  Card,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
  Table,
  Stack,
  IconButton,
  CardContent,
  useMediaQuery,
  useTheme,
  Typography,
  Skeleton,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CheckCircleOutline, CloseCircleOutline } from "mdi-material-ui";
import { Scrollbar } from "src/utils/scrollbar";
import { styled } from "@mui/material/styles";
import { success } from "src/theme/colors";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { leavesApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import { LeavesStatus } from "src/constants/status";
import { NoRecordFound } from "../no-record";

const columns = [
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Manage Leave",
];

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export const LeavesCard = ({ employeeId }: { employeeId: string | any }) => {
  const theme = useTheme();

  const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());
  const [leavesList, setLeavesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLeaves = useCallback(async () => {
    setIsLoading(true);
    if (!employeeId) return;
    let response = await leavesApi.getUserLeaves(employeeId, datePickerDate);

    setLeavesList(response);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePickerDate, employeeId]);

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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDatePickerDate(date);
    }
  };

  const currentYear = new Date().getFullYear();

  const minDate = new Date(currentYear - 3, 0, 1); // January 1st, 5 years ago
  const maxDate = new Date(currentYear, 11, 31);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ position: "relative", minHeight: "530px" }}>
      <CardHeader
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        title={"Leaves"}
        action={
          <DatePicker
            label={"Month And Year"}
            views={["year", "month"]}
            openTo="month"
            sx={{ width: 180 }}
            minDate={minDate}
            maxDate={maxDate}
            value={datePickerDate}
            onChange={handleDateChange}
          />
        }
      />
      <CardContent>
        <Scrollbar sx={{ maxHeight: 370 }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="leave requests table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      <span style={{ fontWeight: 700 }}>{column}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {columns.map((col, colIndex) => (
                        <TableCell key={colIndex} align="center">
                          <Skeleton
                            variant="rounded"
                            width="100%"
                            height={25}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : leavesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <NoRecordFound />
                    </TableCell>
                  </TableRow>
                ) : (
                  leavesList.map((leave, index) => {
                    return (
                      <TableRow hover role="checkbox" key={index}>
                        <TableCell>
                          <Typography width={100}>
                            {leave.leave_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>
                            {formatDate(leave.startDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>
                            {formatDate(leave.endDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <HtmlTooltip
                            arrow
                            title={<Typography>{leave.reason}</Typography>}
                          >
                            <Typography width={150} noWrap>
                              {leave.reason}
                            </Typography>
                          </HtmlTooltip>
                        </TableCell>
                        <TableCell>
                          <Typography width={100}>
                            {leave.status.toUpperCase()}
                          </Typography>
                        </TableCell>

                        {
                          <TableCell>
                            <Stack direction={"row"} spacing={1}>
                              <Tooltip title="Approved">
                                <span>
                                  <IconButton
                                    onClick={() =>
                                      handleUpdateStatus(
                                        leave._id,
                                        LeavesStatus.Approved
                                      )
                                    }
                                    disabled={
                                      leave.status === LeavesStatus.Approved
                                    }
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "green",
                                        color: "white",
                                      },
                                      color: "green",
                                    }}
                                  >
                                    <CheckCircleOutline />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              <Tooltip title="Rejected">
                                <span>
                                  <IconButton
                                    onClick={() =>
                                      handleUpdateStatus(
                                        leave._id,
                                        LeavesStatus.Rejected
                                      )
                                    }
                                    disabled={
                                      leave.status === LeavesStatus.Rejected
                                    }
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "red",
                                        color: "white",
                                      },
                                      color: "red",
                                    }}
                                  >
                                    <CloseCircleOutline />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        }
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};
