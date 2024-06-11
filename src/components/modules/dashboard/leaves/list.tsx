import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Stack,
  Button,
  SvgIcon,
  Link,
  Box,
  IconButton,
  Tooltip,
  Container,
  CardContent,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import {
  Plus,
  SquareEditOutline,
  TrashCanOutline,
  CheckCircleOutline,
  CloseCircleOutline,
} from "mdi-material-ui";

import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { LeaveModal } from "./leave-modal";
import { leavesApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import { ImageAvatar } from "src/components/shared";
import { paths } from "src/constants/paths";
import { LeavesStatus } from "src/constants/status";

const employee_Screen = [
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Action",
];
const HR_Screen = [
  "Employee Name",
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Manage Leave",
  "Action",
];

const LeavesListComponent = () => {
  const settings = useSettings();

  const { user } = useAuth<AuthContextType>();

  const columns =
    user?.role === ROLES.Admin || user?.role === ROLES.HR
      ? HR_Screen
      : employee_Screen;

  const [leaveModal, setLeaveModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [leavesList, setLeavesList] = useState<any[]>([]);
  const [leaveValues, setLeaveValues] = useState();

  const getLeaves = useCallback(async () => {
    let response = [];
    if (user?.role === ROLES.HR || user?.role === ROLES.Admin) {
      response = await leavesApi.getAllLeaves();
    } else {
      response = await leavesApi.getMyLeaves();
    }
    setLeavesList(response);
  }, [user?.role]); // Dependencies array ensures memoization based on user.role

  // useEffect to call getLeaves when the component mounts or when getLeaves changes
  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  const addAndUpdateHoliday = async (values: any) => {
    const { _id, ...LeaveValues } = values;

    if (modalType === "update") {
      await leavesApi.updateLeave(_id, LeaveValues);
    } else {
      if (user?.role === ROLES.Employee) {
        await leavesApi.apllyForLeave(values);
      } else {
        await leavesApi.addLeave(values);
      }
    }
    getLeaves();
    setLeaveModal(false);
    setLeaveValues(undefined);
  };

  const deleteLeave = async (_id: string) => {
    await leavesApi.deleteLeave(_id);
    setLeavesList((prevList) => prevList.filter((leave) => leave._id !== _id));
  };

  const handleUpdateStatus = async (leave_id: string, status: string) => {
    await leavesApi.updateLeaveStatus({ leave_id, status });
    setLeavesList((prevList) =>
      prevList.map((leave) =>
        leave._id === leave_id ? { ...leave, status } : leave
      )
    );
  };

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
          <Stack direction={"row"} justifyContent="space-between" spacing={4}>
            <Typography variant="h4">Leaves</Typography>

            <Button
              onClick={() => {
                setLeaveModal(true);
                setModalType("create");
              }}
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
              variant="contained"
            >
              {user?.role === ROLES.Admin || user?.role === ROLES.HR
                ? "Add Leave"
                : "Leave Apply"}
            </Button>
          </Stack>

          <Card>
            <CardContent>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 440, overflowY: "auto" }}
              >
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
                    {leavesList.map((leave, index) => {
                      return (
                        <TableRow hover role="checkbox" key={index}>
                          {(user?.role === ROLES.Admin ||
                            user?.role === ROLES.HR) && (
                            <TableCell>
                              <Stack
                                alignItems={"center"}
                                direction={"row"}
                                spacing={1}
                              >
                                <ImageAvatar
                                  path={leave.user.avatar || ""}
                                  alt="user image"
                                  width={40}
                                  height={40}
                                />

                                <Link
                                  color="inherit"
                                  href={`${paths.employees}/${leave.user.username}`}
                                  variant="subtitle1"
                                >
                                  {leave.user.full_name}
                                </Link>
                              </Stack>
                            </TableCell>
                          )}

                          <TableCell>{leave.leave_type}</TableCell>
                          <TableCell>{formatDate(leave.startDate)}</TableCell>
                          <TableCell>{formatDate(leave.endDate)}</TableCell>
                          <TableCell>{leave.reason}</TableCell>
                          <TableCell>{leave.status.toUpperCase()}</TableCell>

                          {(user?.role === ROLES.Admin ||
                            user?.role === ROLES.HR) && (
                            <TableCell>
                              <Box sx={{ display: "flex", mx: 3 }}>
                                <Tooltip title="Approved">
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
                                </Tooltip>
                                <Tooltip title="Rejected">
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
                                </Tooltip>
                              </Box>
                            </TableCell>
                          )}
                          <TableCell>
                            <Stack direction={"row"} spacing={2}>
                              <Tooltip title="Edit">
                                <SquareEditOutline
                                  color="success"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setModalType("update");
                                    setLeaveModal(true);
                                    setLeaveValues(leave);
                                  }}
                                />
                              </Tooltip>

                              <Tooltip title="Delete">
                                <TrashCanOutline
                                  color="error"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => deleteLeave(leave._id)}
                                />
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {leaveModal && (
        <LeaveModal
          leaveValues={leaveValues}
          modalType={modalType}
          modal={leaveModal}
          onCancel={() => {
            setLeaveModal(false);
            setLeaveValues(undefined);
          }}
          onConfirm={addAndUpdateHoliday}
        />
      )}
    </Box>
  );
};

const LeavesList: NextPage = () => {
  return <LeavesListComponent />;
};

LeavesList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { LeavesList };
