import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { DashboardLayout } from "src/layouts/dashboard";
import { NextPage } from "next";
import { Employee } from "src/types";
import { useRouter } from "next/router";
import { employeesApi } from "src/api";
import { EmployeeDetails, ShiftDetails, AttendanceChartCard, TaskCard, LeavesCard, ConfirmationModal } from "src/components/shared";
import { useSettings } from "src/hooks";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";


const EmployeeProfileComponent = () => {
  const settings = useSettings();

  const router = useRouter();
  const { username } = router.query;

  const [employeeData, setEmployeeData] = useState<Employee | undefined>();
  const [deleteModal, setDeleteModal] = useState(false);
  // const [isLoading, setIsLoading] = useState(false)

  // Memoize the handleGetEmployee function
  const handleGetEmployee = useCallback(async () => {
    if (!username) return;

    // setIsLoading(true)
    const response = await employeesApi.getEmployee(username);
    setEmployeeData(response);
  }, [username]); // Memoize based on username

  const handleUpdateEmployee = async (values: any) => {
    const { username, ...UpdatedValues } = values;

    const response = await employeesApi.updateEmployee(username, UpdatedValues);

    setEmployeeData(response);
  };

  const handleDeleteEmployee = async (username: any) => {
    await employeesApi.deleteEmployee(username);
    router.back();
  };

  // useEffect to call handleGetEmployee when username changes
  useEffect(() => {
    handleGetEmployee();
  }, [handleGetEmployee]);

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
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h5">{"Employee Profile"}</Typography>

                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="small"
                  onClick={() => setDeleteModal(true)}
                >
                  Delete Employee
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid item xs={12} sx={{mb: 3}}>
                <EmployeeDetails
                  employeeData={employeeData}
                  UpdateEmployee={handleUpdateEmployee}
                />
              </Grid>

              <Grid item xs={12} >
                <ShiftDetails
                  employeeID={employeeData?._id}
                  shiftDetails={employeeData?.shift}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid item xs={12}>
                <TaskCard />
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <AttendanceChartCard employeeUsername={employeeData?._id} />
            </Grid>
            <Grid item xs={12} md={8}>
              <LeavesCard employeeId={employeeData?._id} />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {deleteModal && (
        <ConfirmationModal
          warning_title={"Delete"}
          warning_text={"Are you sure you want to delete the Employee ?"}
          button_text={"Delete"}
          modal={deleteModal}
          onCancel={() => setDeleteModal(false)}
          onConfirm={async () => {
            handleDeleteEmployee(username);
            setDeleteModal(false);
          }}
        />
      )}
    </Box>
  );
};
const EmployeeProfile: NextPage = () => {
  return <EmployeeProfileComponent />;
};
EmployeeProfile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export { EmployeeProfile };
