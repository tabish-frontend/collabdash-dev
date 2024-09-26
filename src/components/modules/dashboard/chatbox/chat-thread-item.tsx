import type { FC } from "react";
import PropTypes from "prop-types";
import { formatDistanceStrict } from "date-fns";
import Avatar, { avatarClasses } from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Message, Participant, Thread } from "src/types";
import { useAuth, useSocketContext } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { customLocale } from "src/utils";
import { OnlineBadge } from "src/components/shared";

const getLastMessage = (thread: Thread): Message | undefined => {
  return thread.messages?.[thread.messages.length - 1];
};

const getRecipients = (
  participants: Participant[],
  userId: string | undefined
): Participant[] => {
  return participants.filter((participant) => participant._id !== userId);
};

const getDisplayName = (recipients: Participant[]): string => {
  return recipients.map((participant) => participant.full_name).join(", ");
};

const getDisplayContent = (
  userId: string | undefined,
  lastMessage?: Message
): string => {
  if (!lastMessage) {
    return "";
  }

  const author = lastMessage.author === userId ? "Me: " : "";
  const message =
    lastMessage.contentType === "image" ? "Sent a photo" : lastMessage.body;

  return `${author}${message}`;
};

const getLastActivity = (lastMessage?: Message): string | null => {
  if (!lastMessage) {
    return null;
  }

  console.log("lastMessage", lastMessage);
  return formatDistanceStrict(new Date(lastMessage.createdAt), new Date(), {
    addSuffix: false,
    locale: customLocale,
  });
};

interface ChatThreadItemProps {
  active?: boolean;
  onSelect?: () => void;
  thread: Thread;
}

export const ChatThreadItem: FC<ChatThreadItemProps> = (props) => {
  const { active = false, thread, onSelect, ...other } = props;
  const { user } = useAuth<AuthContextType>();

  console.log("message box thread", thread);

  const recipients = getRecipients(thread.participants || [], user?._id);
  console.log("recipients", recipients);
  const lastMessage = getLastMessage(thread);
  const lastActivity = getLastActivity(lastMessage);
  const displayName = getDisplayName(recipients);
  console.log("displayName", displayName);
  const displayContent = getDisplayContent(user?._id, lastMessage);
  const groupThread = recipients.length > 1;
  const isUnread = !!(thread.unreadCount && thread.unreadCount > 0);

  const { onlineUsers } = useSocketContext();

  console.log("onlineUsers", onlineUsers);

  const onlineRecipients = recipients.filter((recipient) =>
    onlineUsers.includes(recipient._id as string)
  );

  return (
    <Stack
      component="li"
      direction="row"
      onClick={onSelect}
      spacing={2}
      sx={{
        borderRadius: 2.5,
        cursor: "pointer",
        px: 3,
        py: 2,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...(active && {
          backgroundColor: "action.hover",
        }),
      }}
      {...other}
    >
      <div>
        <AvatarGroup
          max={2}
          sx={{
            [`& .${avatarClasses.root}`]: groupThread
              ? {
                  height: 26,
                  width: 26,
                  "&:nth-of-type(2)": {
                    mt: "10px",
                  },
                }
              : {
                  height: 36,
                  width: 36,
                },
          }}
        >
          {recipients.map((recipient) => {
            const isOnline = onlineUsers.includes(recipient._id as string);
            return isOnline ? (
              <OnlineBadge key={recipient._id} image={recipient.avatar} />
            ) : (
              <Avatar key={recipient._id} src={recipient.avatar || undefined} />
            );
          })}
        </AvatarGroup>
      </div>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Typography noWrap variant="subtitle2">
          {displayName}
        </Typography>
        <Stack alignItems="center" direction="row" spacing={1}>
          {isUnread && (
            <Box
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "50%",
                height: 8,
                width: 8,
              }}
            />
          )}
          <Typography
            color="text.secondary"
            noWrap
            sx={{ flexGrow: 1 }}
            variant="subtitle2"
          >
            {displayContent}
          </Typography>
        </Stack>
      </Box>
      {lastActivity && (
        <Typography
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
          variant="caption"
        >
          {lastActivity}
        </Typography>
      )}
    </Stack>
  );
};

ChatThreadItem.propTypes = {
  active: PropTypes.bool,
  onSelect: PropTypes.func,
  // @ts-ignore
  thread: PropTypes.object.isRequired,
};
