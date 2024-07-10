// ** MUI Imports
import {
  Button,
  Container,
  Stack,
  SvgIcon,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Plus } from "mdi-material-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";

import { EmployeeCard, NoRecordFound, Scrollbar } from "src/components";
import { Employee } from "src/types";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { employeesApi } from "src/api";
import { useRouter } from "next/router";
import { useSettings } from "src/hooks";
import { AccountStatus } from "src/constants/status";
import { useDebouncedCallback } from "use-debounce";

interface FiltersType {
  fields: string;
  account_status: string;
  search: string;
}

const EmployeeListComponent = () => {
  const router = useRouter();
  const settings = useSettings();
  const theme = useTheme();

  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersType>({
    fields: "",
    account_status: "active",
    search: "",
  });

  const handleStatusChange = (event: SyntheticEvent, newValue: string) => {
    setFilters((prev) => ({ ...prev, account_status: newValue }));
  };

  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, 500);

  const handleGetEmployees = async () => {
    setIsLoading(true);
    const response = await employeesApi.getAllEmployees(filters);
    setEmployeesList(response.users);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
          <Stack direction={"row"} justifyContent="space-between" spacing={4}>
            <Typography variant="h4">{"Employee's"}</Typography>

            <Button
              variant="contained"
              size={isSmallScreen ? "small" : "medium"}
              onClick={() => router.push(`${router.pathname}/new`)}
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
            >
              Add Employee
            </Button>
          </Stack>

          <Tabs
            indicatorColor="primary"
            onChange={handleStatusChange}
            value={filters.account_status}
            sx={{
              borderBottom: 1,
              borderColor: "#ddd",
            }}
          >
            {AccountStatus.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disabled={isLoading}
              />
            ))}
          </Tabs>

          <Box component="form" sx={{ flexGrow: 1 }}>
            <OutlinedInput
              defaultValue=""
              fullWidth
              onChange={(e) => {
                debouncedSearch(e.target.value.trim());
              }}
              placeholder="Search with name, designation and department"
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              }
            />
          </Box>

          <Scrollbar sx={{ maxHeight: 650, overflowY: "auto", py: 2, px: 2 }}>
            <Grid container spacing={2}>
              {isLoading ? (
                [...Array(9)].map((_, index) => (
                  <Grid item xs={12} xl={4} lg={6} key={index}>
                    <EmployeeCard isLoading={isLoading} />
                  </Grid>
                ))
              ) : employeesList.length === 0 ? (
                <Grid item xs={12}>
                  <NoRecordFound />
                </Grid>
              ) : (
                employeesList.map((employee: Employee) => (
                  <Grid item xs={12} xl={4} lg={6} key={employee._id}>
                    <EmployeeCard employee={employee} isLoading={isLoading} />
                  </Grid>
                ))
              )}
            </Grid>
          </Scrollbar>
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
