// ** MUI Imports
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

import { Box, CardHeader, Stack, Typography } from "@mui/material";

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.up("md")]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const TaskCard = () => {
  return (
    <>
      <Card sx={{ position: "relative", height: "570px" }}>
        <CardHeader title="Current Tasks" />

        <CardContent sx={{ height: "80%" }}>
          <Stack
            sx={{ height: "100%" }}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography sx={{ margin: "auto"}} align="center">
              This feature is under development and will be available soon. Stay
              tuned for updates!
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
