import React, { useCallback, useEffect, useState } from "react";
import { Card, Typography, Box, Grid, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { getDayFromDate } from "src/utils";

export const WeatherCard = ({ name }: { name: string }) => {
  const [weather, setWeather] = useState<any>();

  const getWeatherReport = useCallback(async (city: any) => {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=e302e3b7b2234b12a4961554242709&q=${city}&days=5&aqi=no&alerts=no`
    );
    setWeather(response.data);
  }, []);

  const getCityFromTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const city = timezone.split("/")[1].replace("_", " ");
    return city;
  };

  useEffect(() => {
    const city = getCityFromTimezone();
    getWeatherReport(city);
  }, [getWeatherReport]);

  return (
    <>
      <Card sx={{ minHeight: 490, padding: 3 }}>
        <Stack
          direction={"column"}
          alignItems={"stretch"}
          justifyContent={"space-between"}
          minHeight={440}
        >
          <Stack direction={"column"} spacing={1} mb={3}>
            <Typography variant="h6" component="div" gutterBottom>
              Weather
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary" ml={1}>
                {`${weather?.location.name}, ${weather?.location.country}`}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h1" component="div">
                {weather?.current.temp_c}°
              </Typography>
              <Box textAlign="center">
                {
                  <img
                    src={weather?.current.condition.icon}
                    alt={weather?.current.condition.text}
                  />
                }
                <Typography variant="body1" color="text.secondary">
                  {weather?.current.condition.text}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            flexWrap={"wrap"}
            spacing={3}
          >
            <Stack direction={"row"} spacing={1}>
              <Typography fontWeight={700} fontSize={14}>
                Wind:{" "}
              </Typography>
              <Typography fontSize={14}>
                {weather?.current.wind_kph} kph
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <Typography fontWeight={700} fontSize={14}>
                Precipitation:{" "}
              </Typography>
              <Typography fontSize={14}>
                {weather?.current.precip_mm} %
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <Typography fontWeight={700} fontSize={14}>
                Humidity:{" "}
              </Typography>
              <Typography fontSize={14}>
                {weather?.current.humidity} %
              </Typography>
            </Stack>
          </Stack>

          <Stack direction={"column"} spacing={2}>
            <Typography variant="h6" gutterBottom>
              Forecast
            </Typography>
            <Grid container spacing={1}>
              {weather?.forecast.forecastday.map(
                (forcastDay: any, index: number) => (
                  <Grid
                    item
                    xs={12 / weather.forecast.forecastday.length}
                    key={index}
                  >
                    <Card
                      sx={{
                        bgcolor: "background.default",
                        textAlign: "center",
                        py: 3,
                      }}
                    >
                      <Typography variant="body2">
                        {getDayFromDate(forcastDay.date)}
                      </Typography>
                      {
                        <img
                          src={forcastDay.day.condition?.icon}
                          alt={forcastDay.day.condition?.text}
                          width={40}
                        />
                      }
                      <Typography variant="body2">
                        {forcastDay.day.avgtemp_c}°
                      </Typography>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
