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
import {
  CoptToClipboard,
  ImageAvatar,
  UserAvatarGroup,
} from "src/components/shared";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { getDay_Time } from "src/utils";
import { FC, useState } from "react";
import { Meeting } from "src/types";
import { useRouter } from "next/router";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { InviteModal } from "./invite-modal";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

interface MeetingCardProps {
  meeting: Meeting;
  isUpcomingMeetings: boolean;
  handleUpdateMeeting?: () => void;
  handleDeleteMeeting?: () => void;
}

export const MeetingCard: FC<MeetingCardProps> = ({
  meeting,
  isUpcomingMeetings,
  handleUpdateMeeting,
  handleDeleteMeeting,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [inviteDialog, setInviteDialog] = useState(false);

  const { user } = useAuth<AuthContextType>();

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        avatar={
          <ImageAvatar
            path={meeting?.owner!.avatar || ""}
            alt={meeting?.owner!.full_name || ""}
            width={50}
            height={50}
          />
        }
        title={
          <Typography variant="h6">{meeting?.owner!.full_name}</Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            Organiser
          </Typography>
        }
        action={
          <Stack direction="row" spacing={0.5}>
            <IconButton
              aria-label="share"
              color="info"
              disabled={!isUpcomingMeetings}
              onClick={() => setInviteDialog(true)}
            >
              <ShareOutlinedIcon />
            </IconButton>

            <CoptToClipboard meeting={meeting} />
          </Stack>
        }
      />
      <CardContent sx={{ paddingTop: 2 }}>
        <Stack direction={"column"} minHeight={80} spacing={1}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {meeting?.title}
          </Typography>
          <Stack
            direction={isSmallScreen ? "column" : "column"}
            justifyContent={"space-between"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            spacing={2}
            flexWrap={"wrap"}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
              flexWrap={"wrap"}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <AccessTimeOutlinedIcon
                  sx={{ fontSize: "18px", color: "text.secondary" }}
                />

                <Typography variant="body2">
                  {getDay_Time(meeting!.time)}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <GroupOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  {`${meeting?.participants?.length} Members`}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              width={"100%"}
            >
              <UserAvatarGroup users={meeting!.participants} />
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
            sx={{ padding: "6px 8px" }}
            color={theme.palette.mode === "dark" ? "info" : "primary"}
            disabled={!isUpcomingMeetings}
            endIcon={<ChevronRightOutlinedIcon />}
            onClick={() => router.push(`${router.pathname}/${meeting?._id}`)}
          >
            Join Meeting
          </Button>

          {user?._id === meeting?.owner!._id && (
            <Stack direction="row" spacing={0.5}>
              <IconButton
                aria-label="edit"
                color="success"
                disabled={!isUpcomingMeetings}
                onClick={handleUpdateMeeting}
              >
                <SquareEditOutline />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                disabled={!isUpcomingMeetings}
                onClick={handleDeleteMeeting}
              >
                <TrashCanOutline />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>

      {inviteDialog && (
        <InviteModal
          open={inviteDialog}
          onClose={() => setInviteDialog(false)}
        />
      )}
    </Card>
  );
};
