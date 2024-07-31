// ** MUI Imports
import {
  CardContent,
  Grid,
  Icon,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  Cancel,
  CheckboxMarkedOutline,
  ClockTimeTwoOutline,
  UmbrellaBeachOutline,
} from "mdi-material-ui";
import { useCallback, useEffect, useState } from "react";
import { statisticsApi } from "src/api";
import { UsersListPopover } from "../lists";

export const EmployeesAvailability = () => {
  const [employeesAvailability, setEmployeesAvailability] = useState<any>([
    {
      key: "present",
      title: "Present",
      icon: CheckboxMarkedOutline,
      values: [],
    },
    {
      key: "on_late",
      title: "Late Coming",
      icon: ClockTimeTwoOutline,
      values: [],
    },
    {
      key: "absent",
      title: "Absent",
      icon: Cancel,
      values: [],
    },
    {
      key: "leave",
      title: "Leave Apply",
      icon: UmbrellaBeachOutline,
      values: [],
    },
  ]);

  useEffect(() => {
    const handleGetTodayAvailability = async () => {
      const response = await statisticsApi.getAllUserAvailability();
      setEmployeesAvailability((prevAvailability: any) =>
        prevAvailability.map((availability: any) => ({
          ...availability,
          values: response.data[availability.key] || [],
        }))
      );
    };

    handleGetTodayAvailability();
  }, []);

  return (
    <Card style={{ minHeight: 490 }}>
      <CardHeader title="Employees Availability" />
      <CardContent>
        <Grid container spacing={2}>
          {employeesAvailability.map((availability: any, index: number) => {
            const employees = availability.values;
            const Icon = availability.icon;
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Tooltip
                  arrow
                  placement={
                    index === 0 || index === 2 ? "left-start" : "right-start"
                  }
                  title={
                    employees.length ? (
                      <UsersListPopover users={employees} />
                    ) : (
                      ""
                    )
                  }
                >
                  <Stack
                    spacing={2}
                    border={"1px solid #ddd"}
                    p={1}
                    borderRadius={1}
                    minHeight={160}
                  >
                    <Icon fontSize="large" sx={{ fontWeight: 900 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {availability.title}
                    </Typography>
                    <Typography variant="subtitle1">
                      {employees.length}
                    </Typography>
                  </Stack>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};
