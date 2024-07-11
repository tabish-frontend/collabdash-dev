// ** MUI Imports
import { CardContent, Grid, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  Cancel,
  CheckboxMarkedOutline,
  ClockTimeTwoOutline,
  UmbrellaBeachOutline,
} from "mdi-material-ui";
import { useEffect, useState } from "react";
import { statisticsApi } from "src/api";

export const EmployeesAvailability = () => {
  const [employeesAvailbiity, setEmployeesAvailbiity] = useState<any>({
    present: 0,
    absent: 0,
    leave: 0,
    on_late: 0,
  });

  const handleGetTodayAvailibility = async () => {
    const response = await statisticsApi.getAllUserAvailability();
    setEmployeesAvailbiity(response.data);
  };

  useEffect(() => {
    handleGetTodayAvailibility();
  }, []);

  return (
    <Card style={{ minHeight: 490 }}>
      <CardHeader title="Employees Availability" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack
              spacing={2}
              border={"1px solid #ddd"}
              p={1}
              borderRadius={1}
              minHeight={160}
            >
              <CheckboxMarkedOutline
                fontSize="large"
                sx={{ fontWeight: 900 }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                Present
              </Typography>
              <Typography variant="subtitle1">
                {employeesAvailbiity.present.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              spacing={2}
              border={"1px solid #ddd"}
              p={1}
              borderRadius={1}
              minHeight={160}
            >
              <ClockTimeTwoOutline fontSize="large" sx={{ fontWeight: 900 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Late Coming
              </Typography>
              <Typography variant="subtitle1">
                {employeesAvailbiity.on_late.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              spacing={2}
              border={"1px solid #ddd"}
              p={1}
              borderRadius={1}
              minHeight={160}
            >
              <Cancel fontSize="large" sx={{ fontWeight: 900 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Absent
              </Typography>
              <Typography variant="subtitle1">
                {employeesAvailbiity.absent.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              spacing={2}
              border={"1px solid #ddd"}
              p={1}
              borderRadius={1}
              minHeight={160}
            >
              <UmbrellaBeachOutline fontSize="large" sx={{ fontWeight: 900 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Leave Apply
              </Typography>
              <Typography variant="subtitle1">
                {employeesAvailbiity.leave.length}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
