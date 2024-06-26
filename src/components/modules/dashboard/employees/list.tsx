// ** MUI Imports
import { Button, Container, Stack, SvgIcon, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Plus } from "mdi-material-ui";
import { useEffect, useState } from "react";

// ** Demo Components Imports
import { EmployeeCard } from "src/components";
import { Employee } from "src/types";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { employeesApi } from "src/api";
import { useRouter } from "next/router";
import { useSettings } from "src/hooks";

const EmployeeListComponent = () => {
  const router = useRouter();

  const settings = useSettings();

  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetEmployees = async () => {
    setIsLoading(true);
    const response = await employeesApi.getAllEmployees();
    setEmployeesList(response.users);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

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
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
              <Stack
                direction={"row"}
                justifyContent="space-between"
                spacing={4}
              >
                <Typography variant="h4">{"Employee's"}</Typography>

                <Button
                  onClick={() => router.push(`${router.pathname}/new`)}
                  startIcon={
                    <SvgIcon>
                      <Plus />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add Employee
                </Button>
              </Stack>
            </Grid>

            {isLoading
              ? [...Array(3)].map((index) => (
                  <Grid item xs={12} xl={4} lg={6} key={index}>
                    <EmployeeCard isLoading={isLoading} />
                  </Grid>
                ))
              : employeesList.map((employee: Employee) => (
                  <Grid item xs={12} xl={4} lg={6} key={employee._id}>
                    <EmployeeCard employee={employee} isLoading={isLoading} />
                  </Grid>
                ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

const EmployeeList: NextPage = () => {
  return <EmployeeListComponent />;
};

EmployeeList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { EmployeeList };
