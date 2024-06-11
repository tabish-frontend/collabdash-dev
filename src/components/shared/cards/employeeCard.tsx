// ** React Imports

// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid, { GridProps } from "@mui/material/Grid";
import { useRouter } from "next/router";

// ** Types Imports
import { Employee } from "src/types";
import { Box } from "@mui/material";
import { ImageAvatar } from "../image-avatar";

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
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

const truncateBio = (bio: string | undefined, maxLength: number) => {
  const defaultText =
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime debitis autem ";
  if (!bio) {
    return defaultText;
  }
  if (bio.length <= maxLength) {
    return bio;
  }

  return bio.substring(0, maxLength) + "...";
};

export const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const router = useRouter();

  return (
    <Card
      sx={{ cursor: "pointer", position: "relative" }}
      onClick={() => router.push(`${router.pathname}/${employee.username}`)}
    >
      <Box
        position={"absolute"}
        top={20}
        right={20}
        bgcolor={"yellowgreen"}
        px={2}
        borderRadius={20}
      >
        <Typography variant="subtitle2" color={"white"}>
          {employee.Today_Status}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <StyledGrid item md={4.5} xs={12}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageAvatar
              path={employee.avatar || ""}
              alt="user image"
              width={120}
              height={120}
            />
          </CardContent>
        </StyledGrid>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            paddingTop: ["0 !important", "0 !important", "1.5rem !important"],
            paddingLeft: [
              "1.5rem !important",
              "1.5rem !important",
              "0 !important",
            ],
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, textTransform: "capitalize" }}
            >
              {employee.full_name}
            </Typography>
            <Button
              style={{
                backgroundColor: "#EEE5FF",
                padding: 5,
                textTransform: "capitalize",
              }}
            >
              {employee.designation}
            </Button>
            <Typography
              variant="body2"
              sx={{ marginBottom: 3.5, marginTop: 3.5 }}
            >
              {truncateBio(employee?.bio, 70)}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};
