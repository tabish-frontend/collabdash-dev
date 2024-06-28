// ** MUI Imports
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";

export const TopPerformers = () => {
  const cardDetails = [
    {
      name: "Luke Short",
      username: "@luke",
      performance: "80%",
      avatar: "/images/avatars/1.png",
    },
    {
      name: "Luke Short",
      username: "@luke",
      performance: "80%",
      avatar: "/images/avatars/1.png",
    },
    {
      name: "Luke Short",
      username: "@luke",
      performance: "80%",
      avatar: "/images/avatars/1.png",
    },
    {
      name: "Luke Short",
      username: "@luke",
      performance: "80%",
      avatar: "/images/avatars/1.png",
    },
    {
      name: "Luke Short",
      username: "@luke",
      performance: "80%",
      avatar: "/images/avatars/1.png",
    },
  ];

  return (
    <Card>
      <CardHeader title="Top Performers" />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
          {cardDetails.map((card, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                textAlign: "center",
                padding: 2,
                marginBottom: 2,
              }}
              variant="outlined"
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                p={3}
              >
                <CardMedia
                  component="img"
                  image={card.avatar}
                  alt="Profile Picture"
                  sx={{ width: 80, height: 80, borderRadius: "50%", mb: 2 }}
                />

                <Typography variant="h6" component="div">
                  {card.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.username}
                </Typography>
                <Typography variant="h4" component="div">
                  {card.performance}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
