import Card from "@mui/material/Card";
import { useRouter } from "next/router";
import {
  Box,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  useTheme,
  Icon,
  useMediaQuery,
} from "@mui/material";
import { ImageAvatar } from "../image-avatar"; // Assuming you have this component for loading avatars
import AddIcon from "@mui/icons-material/Add"; // For the plus icon
import { Skeleton } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { UserAvatarGroup } from "../users-avatar-group";
import { format } from "date-fns";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";

export const MeetingCard = ({
  meeting,
  isLoading,
  handleUpdateMeeting,
  handleDeleteMeeting,
}: {
  meeting?: any;
  isLoading: boolean;
  handleUpdateMeeting?: () => void;
  handleDeleteMeeting?: () => void;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("xl"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const formattedDate = meeting?.date
    ? format(new Date(meeting.date), "MMMM dd, yyyy h:mm a") // e.g., "September 16, 2024 4:00 PM"
    : "Date not available";

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={150} />;
  }

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        avatar={
          <ImageAvatar
            path={meeting?.organiser?.avatar || ""}
            alt={meeting?.organiser?.name || "Organiser"}
            width={50}
            height={50}
            isLoading={isLoading}
          />
        }
        title={
          <Typography variant="h6">
            {meeting?.organiser?.name || "Organizer Name"}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            Organiser
          </Typography>
        }
        action={
          <Stack direction="row" spacing={0.5}>
            <IconButton
              aria-label="edit"
              color="success"
              onClick={handleUpdateMeeting}
            >
              <SquareEditOutline />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleDeleteMeeting}
            >
              <TrashCanOutline />
            </IconButton>
          </Stack>
        }
      />
      <CardContent sx={{ paddingTop: 2 }}>
        <Stack direction={"column"} minHeight={120} spacing={1}>
          <Typography
            variant={isLargeScreen ? "h6" : "h5"}
            fontWeight="bold"
            gutterBottom
          >
            {meeting?.title || "Meeting Title"}
          </Typography>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            flexWrap={"wrap"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <AccessTimeOutlinedIcon
                sx={{ fontSize: "18px", color: "text.secondary" }}
              />

              {/* <Chip label={formattedDate} color="primary" size="small" /> */}
              <Typography variant="body2">{formattedDate}</Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <GroupOutlinedIcon
                sx={{ fontSize: "18px", color: "text.secondary" }}
              />
              <Typography variant="body2">
                {`${meeting?.participants?.length || 0} Members`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pt={2}
        >
          <Button
            variant="text"
            color={theme.palette.mode === "dark" ? "info" : "primary"}
            endIcon={<ChevronRightOutlinedIcon />}
            sx={{ padding: "6px 8px" }}
          >
            Join Meeting
          </Button>

          <UserAvatarGroup users={meeting.participants} />
        </Stack>
      </CardContent>
    </Card>
  );
};
