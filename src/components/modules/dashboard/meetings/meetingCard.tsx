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
  Tooltip,
  Chip,
  SvgIcon,
} from "@mui/material";
import {
  CopyToClipboard,
  ImageAvatar,
  UserAvatarGroup,
} from "src/components/shared";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { getClassDate, getClassTime, getDay_Time } from "src/utils";
import { FC, useState } from "react";
import { Meeting } from "src/types";
import { useRouter } from "next/router";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { InviteModal } from "./invite-modal";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import RepeatIcon from "@mui/icons-material/Repeat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { paths } from "src/constants/paths";

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

  const formatRecurringDays = (days: string[]) => {
    return days.map((day) => day.slice(0, 3)).join(", ");
  };

  const formatMeetingTime = (time: Date | null): string => {
    if (!time) return "Time not set";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card sx={{ position: "relative", minHeight: 310 }}>
      <CardHeader
        title={
          <Stack direction={"row"} spacing={1}>
            <Typography variant={isSmallScreen ? "h6" : "h5"}>
              Topic:
            </Typography>
            <Typography variant={isSmallScreen ? "subtitle1" : "h5"}>
              {meeting?.title}
            </Typography>
          </Stack>
        }
        action={
          <Stack direction="row" spacing={0.5}>
            <IconButton
              aria-label="share"
              color="info"
              // disabled={!isUpcomingMeetings}
              disabled
              onClick={() => setInviteDialog(true)}
            >
              <ShareOutlinedIcon />
            </IconButton>

            <CopyToClipboard meeting={meeting} disabled={!isUpcomingMeetings} />
          </Stack>
        }
      />
      <CardContent sx={{ paddingTop: 2 }}>
        <Stack direction={"column"} minHeight={80} spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          ></Stack>
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
              alignItems={"flex-start"}
              width={"100%"}
              flexWrap={"wrap"}
            >
              <Stack direction={"column"} spacing={0.5}>
                {!meeting.recurring && (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <CalendarMonthIcon
                      sx={{ fontSize: "18px", color: "text.secondary" }}
                    />

                    <Typography variant="body2">
                      {getClassDate(meeting!.time)}
                    </Typography>
                  </Stack>
                )}
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <AccessTimeOutlinedIcon
                    sx={{ fontSize: "18px", color: "text.secondary" }}
                  />

                  <Typography variant="body2">
                    {meeting.recurring
                      ? `Every ${formatRecurringDays(
                          meeting.meeting_days
                        )} at ${formatMeetingTime(meeting.time)}`
                      : getClassTime(meeting!.time)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={"column"} spacing={0.5}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <GroupOutlinedIcon fontSize="small" />
                  <Typography variant="body2">
                    {`${meeting?.participants?.length} ${
                      meeting?.participants?.length === 1 ? "Member" : "Members"
                    }`}
                  </Typography>
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
              width={"100%"}
              flexWrap={"wrap"}
            >
              <Stack direction={"row"} spacing={1} alignItems={"center"} mb={1}>
                <ImageAvatar
                  path={meeting?.owner!.avatar || ""}
                  alt={meeting?.owner!.full_name || ""}
                  width={isSmallScreen ? 40 : 40}
                  height={isSmallScreen ? 40 : 40}
                />
                <Stack>
                  <Typography variant="h6">
                    {meeting?.owner!.full_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Organiser
                  </Typography>
                </Stack>
              </Stack>
              {meeting.recurring && (
                <Tooltip
                  title={`Recurring: ${formatRecurringDays(
                    meeting.meeting_days
                  )}`}
                >
                  <Chip
                    icon={
                      <SvgIcon>
                        <RepeatIcon sx={{ color: "#20708b" }} />
                      </SvgIcon>
                    }
                    label="Recurring"
                    size="medium"
                    color="primary"
                    variant="outlined"
                    sx={{
                      p: { xs: 0, sm: 0.5 },
                      border: "1px solid #20708b",
                      fontSize: { xs: 12, sm: 14 },
                    }}
                  />
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pt={3}
        >
          <Button
            variant="contained"
            size="small"
            color={theme.palette.mode === "dark" ? "info" : "primary"}
            disabled={!isUpcomingMeetings}
            endIcon={<ChevronRightOutlinedIcon />}
            onClick={() => router.push(`${paths.meetings}/${meeting?._id}`)}
            sx={{ borderRadius: 30 }}
          >
            Join Meeting
          </Button>

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
