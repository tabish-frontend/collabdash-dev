// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
// ** Types Imports
import {
  Button,
  CardHeader,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { Chart } from "../charts/style";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const chart: any = {
  options: {
    labels: ["Present", "Absent"],
    colors: ["#2E7D32", "#C62828"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 600,
      labels: {
        colors: ["#4CAF50", "#FFC107"], // Customize legend labels color
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (value: number) => {
          return `${value}%`; // Only show the percentage value
        },
      },
    },
  },
};

export const AttendanceChartCard = ({
  employeeUsername,
}: {
  employeeUsername: string | undefined;
}) => {
  const router = useRouter();
  const currentDate = new Date();

  const [chartSeries, setChartSeries] = useState([88, 12]);

  const [chartFilter, setChartFilter] = useState<Date | null>(currentDate);

  const handleDateChange = (date: Date | null) => {
    setChartFilter(date);
  };

  const handleNavigate = () => {
    router.push({
      pathname: "/attendance",
      query: {
        user: employeeUsername,
        date: chartFilter?.toISOString(),
      },
    });
  };

  const currentYear = currentDate.getFullYear();

  const minDate = new Date(currentYear - 3, 0, 1); // January 1st, 5 years ago
  const maxDate = new Date(currentYear, 11, 31);

  return (
    <>
      <Card sx={{ position: "relative", minHeight: "530px" }}>
        <CardHeader
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
          title={"% of Attendance"}
          action={
            <DatePicker
              label={"Month And Year"}
              views={["year", "month"]}
              openTo="month"
              minDate={minDate}
              maxDate={maxDate}
              value={chartFilter}
              onChange={handleDateChange}
            />
          }
        />
        <CardContent>
          <Stack direction="column" spacing={5}>
            <Chart
              height={320}
              options={chart.options}
              series={chartSeries}
              type="donut"
            />

            <Button variant="contained" onClick={handleNavigate}>
              View Full Detail
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
