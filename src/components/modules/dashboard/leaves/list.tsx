import {
  Paper,
  TableBody,
  TableCell,
  Typography,
  Card,
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
  Container,
  CardContent,
  Skeleton,
  useMediaQuery,
  useTheme,
  CardHeader,
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

import { useAuth, useDialog, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { LeaveModal } from "./leave-modal";
import { leavesApi } from "src/api";
import { formatDate } from "src/utils/helpers";
import {
  ConfirmationModal,
  ImageAvatar,
  NoRecordFound,
  RouterLink,
} from "src/components/shared";
import { paths } from "src/constants/paths";
import { DatePicker } from "@mui/x-date-pickers";
import Tooltip from "@mui/material/Tooltip";
import { Scrollbar } from "src/utils/scrollbar";
import UpdateLeavesStatus from "src/components/shared/leaves-status";
import UpdateAction from "src/components/shared/update-action";
import DeleteAction from "src/components/shared/delete-action";

const employee_Screen = [
  "Applied Date",
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Action",
];
const HR_Screen = [
  "Employee Name",
  "Applied Date",
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Manage Leave",
  "Action",
];

interface LeaveDialogData {
  type: string;
  values?: object;
}

interface DeleteLeaveDialogData {
  id: string;
}

const LeavesListComponent = () => {
  const settings = useSettings();

  const currentYear = new Date().getFullYear();

  const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());

  const { user } = useAuth<AuthContextType>();

  const columns =
    user?.role === ROLES.Admin || user?.role === ROLES.HR
      ? HR_Screen
      : employee_Screen;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leavesList, setLeavesList] = useState<any[]>([]);

  const getLeaves = useCallback(async () => {
    setIsLoading(true);
    let response = [];
    if (user?.role === ROLES.HR || user?.role === ROLES.Admin) {
      response = await leavesApi.getAllUserLeaves(datePickerDate);
    } else {
      response = await leavesApi.getMyLeaves(datePickerDate);
    }
    setLeavesList(response);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePickerDate]);

  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  const LeaveDialog = useDialog<LeaveDialogData>();
  const DeleteLeaveDialog = useDialog<DeleteLeaveDialogData>();

  const addAndUpdateLeaves = async (values: any) => {
    const { _id, ...LeaveValues } = values;

    if (LeaveDialog.data?.type === "update") {
      await leavesApi.updateLeave(_id, LeaveValues);
    } else {
      if (user?.role === ROLES.Employee) {
        await leavesApi.apllyForLeave(values);
      } else {
        await leavesApi.addLeave(values);
      }
    }
    getLeaves();
    LeaveDialog.handleClose();
  };

  const deleteLeave = async (_id: string | undefined) => {
    if (!_id) return null;
    await leavesApi.deleteLeave(_id);
    setLeavesList((prevList) => prevList.filter((leave) => leave._id !== _id));
    DeleteLeaveDialog.handleClose();
  };

  const handleUpdateStatus = async (leave_id: string, status: string) => {
    await leavesApi.updateLeaveStatus({ leave_id, status });
    setLeavesList((prevList) =>
      prevList.map((leave) =>
        leave._id === leave_id ? { ...leave, status } : leave
      )
    );
  };

  const minDate = new Date(currentYear - 3, 0, 1); // January 1st, 5 years ago
  const maxDate = new Date(currentYear, 11, 31);

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
              variant="contained"
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
              onClick={() => {
                LeaveDialog.handleOpen({
                  type: "create",
                });
              }}
            >
              {user?.role === ROLES.Admin || user?.role === ROLES.HR
                ? "Add Leave"
                : "Leave Apply"}
            </Button>
          </Stack>

          <Card>
            <CardHeader
              action={
                <DatePicker
                  label={"Month And Year"}
                  views={["year", "month"]}
                  openTo="month"
                  sx={{ width: 180 }}
                  minDate={minDate}
                  maxDate={maxDate}
                  value={datePickerDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setDatePickerDate(date);
                    }
                  }}
                />
              }
            />
            <CardContent>
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Scrollbar sx={{ maxHeight: 470 }}>
                  <Table stickyHeader>
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
                              <TableCell
                                key={colIndex}
                                align="center"
                                width={150}
                              >
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
                              {(user?.role === ROLES.Admin ||
                                user?.role === ROLES.HR) && (
                                <TableCell>
                                  <Stack
                                    alignItems={"center"}
                                    direction={"row"}
                                    justifyContent={"center"}
                                    spacing={1}
                                    width={150}
                                  >
                                    <ImageAvatar
                                      path={leave.user.avatar || ""}
                                      alt="user image"
                                      width={40}
                                      height={40}
                                    />

                                    <Link
                                      color="inherit"
                                      component={RouterLink}
                                      href={`${paths.employees}/${leave.user.username}`}
                                      variant="subtitle2"
                                      sx={{ textTransform: "capitalize" }}
                                    >
                                      {leave.user.full_name}
                                    </Link>
                                  </Stack>
                                </TableCell>
                              )}

                              <TableCell>
                                <Typography width={150}>
                                  {formatDate(leave.createdAt)}
                                </Typography>
                              </TableCell>

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
                                <Tooltip
                                  arrow
                                  title={
                                    <Typography>{leave.reason}</Typography>
                                  }
                                >
                                  <Typography width={200} noWrap>
                                    {leave.reason}
                                  </Typography>
                                </Tooltip>
                              </TableCell>

                              <TableCell>
                                <Typography>
                                  {leave.status.toUpperCase()}
                                </Typography>
                              </TableCell>

                              {(user?.role === ROLES.Admin ||
                                user?.role === ROLES.HR) && (
                                <UpdateLeavesStatus
                                  handleUpdateStatus={handleUpdateStatus}
                                  leaveId={leave._id}
                                  leaveStatus={leave.status}
                                />
                              )}

                              <TableCell>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"center"}
                                  spacing={1}
                                >
                                  <UpdateAction
                                    handleUpdateDialog={() =>
                                      LeaveDialog.handleOpen({
                                        type: "update",
                                        values: leave,
                                      })
                                    }
                                  />

                                  <DeleteAction
                                    handleDeleteDialog={() =>
                                      DeleteLeaveDialog.handleOpen({
                                        id: leave._id,
                                      })
                                    }
                                  />
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {LeaveDialog.open && (
        <LeaveModal
          leaveValues={LeaveDialog.data?.values}
          modalType={LeaveDialog.data?.type}
          modal={LeaveDialog.open}
          onCancel={LeaveDialog.handleClose}
          onConfirm={addAndUpdateLeaves}
        />
      )}

      {DeleteLeaveDialog.open && (
        <ConfirmationModal
          modal={DeleteLeaveDialog.open}
          onCancel={DeleteLeaveDialog.handleClose}
          onConfirm={() => deleteLeave(DeleteLeaveDialog.data?.id)}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete the Leave ?",
          }}
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
