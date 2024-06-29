// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
// ** Types Imports
import {
  Button,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import GaugeChart from "../charts/GaugeChart";
import { Chart } from "../charts/style";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const chart: any = {
  options: {
    labels: ["Present", "Absent"],
    colors: ["#00A8AD", "#0089FA"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 600,
      labels: {
        colors: ["#00A8AD", "#0089FA"], // Customize legend labels color
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

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
const yearOptions = [
  { value: 2020, label: "2020" },
  { value: 2021, label: "2021" },
  { value: 2022, label: "2022" },
  { value: 2023, label: "2023" },
  { value: 2024, label: "2024" },
];

interface Filters {
  month: number;
  year: number;
}

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
      <Card sx={{ position: "relative" }}>
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
              sx={{ width: 180 }}
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
