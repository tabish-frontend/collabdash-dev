import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  Link,
} from "@mui/material";
import { NoRecordFound, RouterLink } from "src/components/shared";
import { paths } from "src/constants/paths";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

export const WaitingScreen = ({ message }: { message: any }) => {
  const { user } = useAuth<AuthContextType>();

  const notFound = message.includes("not found");

  const customImage = notFound
    ? "/assets/icons/notFound404.png"
    : "/assets/icons/waiting.png";

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
          <Stack direction={"column"} spacing={5}>
            {user && (
              <Link
                component={RouterLink}
                href={paths.meetings}
                underline="hover"
                variant="subtitle2"
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                Back To Meetings
              </Link>
            )}

            <Stack alignItems={"center"} spacing={3}>
              <img
                width={300}
                height={300}
                alt="error-illustration"
                src={customImage}
              />

              <Typography variant={notFound ? "h5" : "h6"}>
                {message}
              </Typography>

              {!notFound && (
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                >
                  Join Meeting
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
