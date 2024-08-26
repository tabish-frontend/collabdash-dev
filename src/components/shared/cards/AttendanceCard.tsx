// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { MenuItem, TextField, Theme, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { statisticsApi } from "src/api";

// Define month options
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

// Import ApexOptions
import { ApexOptions } from "apexcharts";
import { Chart } from "../charts/style";

// Define chart options
const chartOptions = (theme: Theme): ApexOptions => ({
  chart: {
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
      tools: {
        download: false, // Hides the download dropdown
      },
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "top",
          color: theme.palette.text.primary,
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      dataLabels: {
        total: {
          style: {
            fontSize: "13px",
            fontWeight: 600,
          },
        },
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  legend: {
    position: "top",
    labels: {
      colors: theme.palette.text.primary,
    },
  },
  fill: {
    opacity: 1,
  },
  colors: ["#56CA00", "#cc3b3b", "#ddd"],
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toFixed(0);
      },
    },
  },
});

// Define interfaces for chart data
interface ChartSeries {
  name: string;
  data: number[];
}

interface ChartData {
  series: ChartSeries[];
  categories: string[];
}

interface Filters {
  month: number;
  year: number;
}

export const AttendanceCard = () => {
  const currentDate = new Date();

  const [filters, setFilters] = useState<Filters>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const theme = useTheme();

  const [attendanceData, setAttendanceData] = useState<Record<
    string,
    any
  > | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    categories: [],
  });

  const fetchAttendance = useCallback(async () => {
    const response = await statisticsApi.getAllUserMonthlyAttendance(filters);

    setAttendanceData(response.data);
  }, [filters]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    const processChartData = () => {
      if (!attendanceData) return;

      const currentDate = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;

      const dates = Object.keys(attendanceData);
      const presents: number[] = [];
      const absents: number[] = [];
      const noValues: number[] = [];

      dates.forEach((date) => {
        const responseDate = new Date(date).getDate();
        const responseMonth = new Date(date).getMonth() + 1;

        if (
          responseMonth > currentMonth ||
          (responseMonth === currentMonth && responseDate > currentDate)
        ) {
          noValues.push(0.12);
          presents.push(0);
          absents.push(0);
        } else {
          noValues.push(0);
          presents.push(attendanceData[date].present);
          absents.push(attendanceData[date].absent);
        }
      });

      setChartData({
        series: [
          { name: "Present", data: presents },
          { name: "Absent", data: absents },
          { name: "No Values", data: noValues },
        ],
        categories: dates.map((date) => `${date}/${filters.year} GMT`),
      });
    };

    processChartData();
  }, [attendanceData, filters.year]);

  return (
    <Card>
      <CardHeader
        title="Monthly Attendance"
        sx={{
          pt: 5.5,
          alignItems: "center",
          "& .MuiCardHeader-action": { mt: 0.6 },
        }}
        action={
          <TextField
            variant="standard"
            select
            value={filters.month}
            onChange={(e) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                month: Number(e.target.value),
              }))
            }
          >
            {monthOptions.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        }
      />
      <CardContent sx={{ pb: (theme) => `${theme.spacing(5.5)} !important` }}>
        {chartData.series.length > 0 ? (
          <Chart
            options={{
              ...chartOptions(theme),
              xaxis: {
                type: "datetime",
                categories: chartData.categories,
                labels: {
                  style: {
                    colors: theme.palette.text.primary,
                  },
                },
              },
            }}
            series={chartData.series}
            type="bar"
            height={350}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </CardContent>
    </Card>
  );
};
