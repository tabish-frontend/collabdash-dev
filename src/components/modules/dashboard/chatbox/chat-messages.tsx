import type { FC } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";

import type { Message, Participant } from "src/types/chat";
import type { User } from "src/types/user";

import { ChatMessage } from "./chat-message";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

const getAuthor = (
  message: Message,
  participants: Participant[],
  user: User | null
) => {
  const participant = participants.find(
    (participant) => participant._id === message.author
  );

  // This should never happen
  if (!participant) {
    return {
      full_name: "Unknown",
      avatar: "",
      isUser: false,
    };
  }

  // Since chat mock db is not synced with external auth providers
  // we set the user details from user auth state instead of thread participants
  if (message?.author === user?._id) {
    return {
      full_name: "Me",
      avatar: user?.avatar,
      isUser: true,
    };
  }

  return {
    avatar: participant!.avatar,
    full_name: participant.full_name,
    isUser: false,
  };
};

interface ChatMessagesProps {
  messages?: any[];
  participants?: Participant[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { messages = [], participants = [], ...other } = props;
  const { user } = useAuth<AuthContextType>();

  return (
    <Stack spacing={2} sx={{ p: 3 }} {...other}>
      {messages.map((message) => {
        const author = getAuthor(message, participants, user);

        return (
          <ChatMessage
            authorAvatar={author.avatar}
            authorName={author.full_name || ""}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message._id}
            position={author.isUser ? "right" : "left"}
            isGroup={participants.length > 2}
          />
        );
      })}
    </Stack>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
};
