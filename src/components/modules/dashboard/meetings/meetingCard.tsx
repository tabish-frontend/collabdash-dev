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
import { FC, useState } from "react";
import { Meeting } from "src/types";
import { useRouter } from "next/router";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { InviteModal } from "./invite-modal";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

interface MeetingCardProps {
  meeting?: Meeting;
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
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const renameTitle = (title: string) => {
    return title.replace(" ", "%20");
  };

  const [openDialog, setOpenDialog] = useState(false);

  // Handle opening and closing of the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle sending the invite (placeholder function)
  const handleSendInvite = (emails: string[]) => {
    console.log("Inviting emails: ", emails);
    // Add your actual logic to send invites here
  };

  const { user } = useAuth<AuthContextType>();

  console.log("User: ", user);

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        avatar={
          <ImageAvatar
            path={meeting?.owner!.avatar || ""}
            alt={meeting?.owner!.full_name || ""}
            width={50}
            height={50}
            isLoading={isLoading}
          />
        }
        title={
          isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={20} />
          ) : (
            <Typography variant="h6">{meeting?.owner!.full_name}</Typography>
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
                aria-label="share"
                color="info"
                onClick={handleOpenDialog}
              >
                <ShareOutlinedIcon />
              </IconButton>
              <IconButton aria-label="delete" color="default">
                <ContentCopyOutlinedIcon />
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
            direction={isSmallScreen ? "column" : "column"}
            justifyContent={"space-between"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            spacing={2}
            flexWrap={"wrap"}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={15} />
            ) : (
              <>
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
                endIcon={<ChevronRightOutlinedIcon />}
                color={theme.palette.mode === "dark" ? "info" : "primary"}
                sx={{ padding: "6px 8px" }}
                onClick={() =>
                  router.push(
                    `${router.pathname}/${renameTitle(meeting!.title)}`
                  )
                }
              >
                Join Meeting
              </Button>

              {user?._id === meeting?.owner!._id && (
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
              )}
            </>
          )}
        </Stack>
      </CardContent>

      <InviteModal
        open={openDialog}
        onClose={handleCloseDialog}
        onSendInvite={handleSendInvite}
      />
    </Card>
  );
};
