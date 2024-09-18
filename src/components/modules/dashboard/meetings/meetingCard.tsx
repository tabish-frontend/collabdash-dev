import Card from "@mui/material/Card";
import {
  CardHeader,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ImageAvatar, UserAvatarGroup } from "src/components/shared"; // Assuming you have this component for loading avatars
import { Skeleton } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { getDay_Time } from "src/utils";
import { FC } from "react";

interface MeetingCardProps {
  meeting?: any;
  isLoading: boolean;
  handleUpdateMeeting?: () => void;
  handleDeleteMeeting?: () => void;
}

export const MeetingCard: FC<MeetingCardProps> = ({
  meeting,
  isLoading,
  handleUpdateMeeting,
  handleDeleteMeeting,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={20} />
          ) : (
            <Typography variant="h6">
              {meeting?.organiser?.name || "Organizer Name"}
            </Typography>
          )
        }
        subheader={
          isLoading ? (
            <Skeleton variant="text" width="100%" height={10} sx={{ mt: 1 }} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Organiser
            </Typography>
          )
        }
        action={
          isLoading ? (
            <Stack direction="row" spacing={0.5} ml={3} mt={1}>
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="circular" width={25} height={25} />
            </Stack>
          ) : (
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
          )
        }
      />
      <CardContent sx={{ paddingTop: 2 }}>
        <Stack direction={"column"} minHeight={80} spacing={1}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={20} />
          ) : (
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {meeting?.title}
            </Typography>
          )}
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            justifyContent={"space-between"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            flexWrap={"wrap"}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={15} />
            ) : (
              <>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <AccessTimeOutlinedIcon
                    sx={{ fontSize: "18px", color: "text.secondary" }}
                  />

                  <Typography variant="body2">
                    {getDay_Time(meeting.date)}
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <GroupOutlinedIcon fontSize="small" />
                  <Typography variant="body2">
                    {`${meeting?.participants?.length} Members`}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pt={2}
        >
          {isLoading ? (
            <>
              <Skeleton variant="rounded" width={120} height={20} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          ) : (
            <>
              <Button
                variant="text"
                color={theme.palette.mode === "dark" ? "info" : "primary"}
                endIcon={<ChevronRightOutlinedIcon />}
                sx={{ padding: "6px 8px" }}
              >
                Join Meeting
              </Button>

              <UserAvatarGroup users={meeting.participants} />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
