import { Stack, useMediaQuery, useTheme, } from "@mui/material";
import React from "react";

export default function NoRecordFound() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
      <img
        width={isSmallScreen ? 200 : 400}
        height={isSmallScreen ? 150 : 300}
        alt="error-illustration"
        src="/images/pages/nodata.png"
      />
    </Stack>
  );
}
