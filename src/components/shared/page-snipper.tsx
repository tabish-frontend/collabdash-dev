import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { blue } from "src/theme/colors";

export const PageSpinner = ({
  spinnerSize = 50,
  boxSize = "100vh",
}: {
  spinnerSize?: number;
  boxSize?: string;
}): any => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: boxSize,
    }}
  >
    <CircularProgress
      style={{ color: blue.main }}
      thickness={4}
      size={spinnerSize}
    />
  </Box>
);
