import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export const ThankYouScreen = () => {
  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
            <Typography variant={"h6"}>
              {"Thank You for using Collab Dash Meet"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
