// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import { statisticsApi } from "src/api";
import { Chart } from "../charts/style";

const chart: any = {
  options: {
    labels: ["Man", "Women"],
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
    },
  },
};

export const TotalEmployees = () => {
  const [chartSeries, setChartSeries] = useState([1, 0]);

  const handleGetTotalEmployees = async () => {
    const response = await statisticsApi.getTotalUsers();
    setChartSeries([response.data.man, response.data.women]);
  };

  useEffect(() => {
    handleGetTotalEmployees();
  }, []);

  return (
    <Card>
      <CardHeader
        title="Total Employees"
        sx={{
          alignItems: "center",
        }}
        action={
          <Typography variant="h5">
            {chartSeries[0] + chartSeries[1]}
          </Typography>
        }
      />

      <CardContent>
        <Chart
          height={320}
          options={chart.options}
          series={chartSeries}
          type="donut"
        />
      </CardContent>
    </Card>
  );
};
