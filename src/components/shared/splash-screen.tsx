import type { FC } from "react";
import Box from "@mui/material/Box";

import { Logo } from "src/components/shared/logos/logo";
import { useTheme } from "@mui/material";

export const SplashScreen: FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        p: 3,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          height: 300,
          width: 400,
        }}
      >
        <Logo color={theme.palette.mode === "dark" ? "#f1f2f2" : "#00455e"} />
      </Box>
    </Box>
  );
};
