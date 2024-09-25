import {
  Typography,
  Card,
  Stack,
  Button,
  SvgIcon,
  Box,
  Container,
  CardContent,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { Plus } from "mdi-material-ui";

import { useAuth, useDialog, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { LeaveModal } from "./leave-modal";
import { leavesApi } from "src/api";
import { ConfirmationModal } from "src/components/shared";
import { DatePicker } from "@mui/x-date-pickers";
import { AllUserLeaves } from "./tabs/all-user-leaves";
import { MyLeaves } from "./tabs/my-leaves";

interface LeaveDialogData {
  type: string;
  isEmployee: boolean;
  values?: object;
}

interface DeleteLeaveDialogData {
  id: string;
}

const TabStatus = [
  {
    label: "Employees Leaves",
    value: "employees_leaves",
    roles: ["admin", "hr"], // Accessible by admin and HR
  },
  {
    label: "My Leaves",
    value: "my_leaves",
    roles: ["employee", "hr"], // Accessible by employees and HR
  },
];

const LeavesListComponent = () => {
  const settings = useSettings();
  const { user } = useAuth<AuthContextType>();

  const [tabValue, setTabValue] = useState<string | string[]>(
    user?.role === ROLES.Employee ? "my_leaves" : "employees_leaves"
  );

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const currentYear = new Date().getFullYear();

  const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leavesList, setLeavesList] = useState<any[]>([]);

  const getLeaves = useCallback(async () => {
    setIsLoading(true);
    let response = [];

    if (tabValue === "employees_leaves") {
      response = await leavesApi.getAllUserLeaves(datePickerDate);
    } else {
      response = await leavesApi.getMyLeaves(datePickerDate);
    }

    setLeavesList(response);
    setIsLoading(false);
  }, [datePickerDate, tabValue]);

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
      if (LeaveDialog.data?.isEmployee) {
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
    setLeavesList((prevList) =>
      prevList.map((leave) =>
        leave._id === leave_id ? { ...leave, status } : leave
      )
    );
    await leavesApi.updateLeaveStatus({ leave_id, status });
  };

  const minDate = new Date(currentYear - 3, 0, 1);
  const maxDate = new Date(currentYear, 11, 31);
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Typography variant="h4">Leaves</Typography>

          <Card>
            <CardContent>
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                spacing={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                borderBottom={1}
                borderColor={"#ddd"}
                pb={1}
                mb={2}
              >
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabChange}
                  value={tabValue}
                >
                  {TabStatus.filter((tab) =>
                    tab.roles.includes(user?.role || "")
                  ).map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </Tabs>

                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {tabValue === "my_leaves" && (
                    <Button
                      variant="contained"
                      sx={{ minWidth: 140 }}
                      size={isSmallScreen ? "small" : "medium"}
                      startIcon={<Plus />}
                      onClick={() => {
                        LeaveDialog.handleOpen({
                          type: "create",
                          isEmployee: true,
                        });
                      }}
                    >
                      Apply Leave
                    </Button>
                  )}

                  {tabValue === "employees_leaves" && (
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ minWidth: 130 }}
                      size={isSmallScreen ? "small" : "medium"}
                      startIcon={<Plus />}
                      onClick={() => {
                        LeaveDialog.handleOpen({
                          type: "create",
                          isEmployee: false,
                        });
                      }}
                    >
                      Add Leave
                    </Button>
                  )}

                  <DatePicker
                    label={"Month And Year"}
                    views={["year", "month"]}
                    openTo="month"
                    sx={{ maxWidth: 180, height: 45 }}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={datePickerDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setDatePickerDate(date);
                      }
                    }}
                  />
                </Stack>
              </Stack>

              {tabValue === "employees_leaves" ? (
                <AllUserLeaves
                  leavesList={leavesList}
                  isLoading={isLoading}
                  LeaveDialog={LeaveDialog}
                  handleUpdateStatus={handleUpdateStatus}
                  DeleteLeaveDialog={DeleteLeaveDialog}
                />
              ) : (
                <MyLeaves
                  leavesList={leavesList}
                  isLoading={isLoading}
                  LeaveDialog={LeaveDialog}
                  DeleteLeaveDialog={DeleteLeaveDialog}
                />
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {LeaveDialog.open && (
        <LeaveModal
          leaveValues={LeaveDialog.data?.values}
          modalType={LeaveDialog.data?.type}
          showEmployees={!LeaveDialog.data?.isEmployee || false}
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
