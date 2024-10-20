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
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";

import { EmployeeCard, NoRecordFound } from "src/components/shared";
import { Scrollbar } from "src/utils/scrollbar";
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
  role: string;
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
    role: "",
  });

  const handleStatusChange = (event: SyntheticEvent, newValue: string) => {
    setFilters((prev) => ({ ...prev, account_status: newValue }));
  };

  const debouncedSearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, 500);

  const handleGetEmployees = useCallback(async () => {
    setIsLoading(true);
    const response = await employeesApi.getAllEmployees(filters);
    setEmployeesList(response.users);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    handleGetEmployees();
  }, [handleGetEmployees]);

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
          <Stack direction={"row"} justifyContent="space-between" spacing={2}>
            <Typography variant="h5">{"Team Members"}</Typography>

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
              Add Member
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

          <Scrollbar sx={{ maxHeight: 580, overflowY: "auto", py: 2, px: 2 }}>
            <Grid container spacing={2}>
              {isLoading ? (
                [...Array(9)].map((_, index) => (
                  <Grid item xs={12} sm={6} xl={4} key={index}>
                    <EmployeeCard isLoading={isLoading} />
                  </Grid>
                ))
              ) : !employeesList.length ? (
                <Grid item xs={12}>
                  <NoRecordFound />
                </Grid>
              ) : (
                employeesList.map((employee: Employee) => (
                  <Grid item xs={12} sm={6} xl={4} key={employee._id}>
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
