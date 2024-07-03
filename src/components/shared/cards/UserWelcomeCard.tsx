// ** MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import RefreshIcon from "mdi-material-ui/RefreshCircle";
import { useState } from "react";
import { quotes } from "src/constants/quotes";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

// Styled component for the triangle shaped background image
const TriangleImg = styled("img")({
  right: 0,
  top: 0,
  height: 170,
  position: "absolute",
  rotate: "270deg",
  marginTop: -10,
});

export const WelcomeCard = () => {
  const { user } = useAuth<AuthContextType>();

  // ** Hook
  const theme = useTheme();

  const [quote, setQuote] = useState<string>(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const handleNewQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const imageSrc =
    theme.palette.mode === "light" ? "triangle-light.png" : "triangle-dark.png";

  return (
    <Card sx={{ position: "relative" }}>
      <CardContent sx={{ height: 220 }}>
        <TriangleImg
          alt="triangle background"
          src={`/images/misc/${imageSrc}`}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ fontSize: "24px", fontWeight: "bold" }}
          >{`Welcome !! ${user?.full_name}`}</Typography>

          <IconButton color="secondary" onClick={handleNewQuote}>
            <RefreshIcon fontSize="large" />
          </IconButton>
        </Box>
        <br />

        <Typography variant="h6" sx={{ letterSpacing: "0.25px" }}>
          <q>{quote}</q>
        </Typography>
      </CardContent>
    </Card>
  );
};
