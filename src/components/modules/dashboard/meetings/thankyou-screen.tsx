import { Box, Card, CardContent, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

export const ThankYouScreen = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 10
      }}
    >
      <Card>
        <CardContent sx={{ paddingTop: 2 }}>
          <Stack
            direction={"column"}
            spacing={5}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image width={isSmallScreen ? 300 : 400} height={isSmallScreen ? 300 : 400} src={"/assets/icons/thankyou.png"} alt="thankyou" />
            <Typography variant={isSmallScreen ? "h6" : "h5"} textAlign={"center"}>
              {"Thank You for using Collab Dash Meet"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
