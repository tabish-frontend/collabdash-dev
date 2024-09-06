import type { FC } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";

import type { Message, Participant } from "src/types/chat";
import type { User } from "src/types/user";

import { ChatMessage } from "./chat-message";
import { useAuth, useMockedUser } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { Employee } from "src/types";

const getAuthor = (message: Message, participants: Employee[], user: User) => {
  const participant = participants.find(
    (participant) => participant._id === message.authorId
  );

  // This should never happen
  if (!participant) {
    return {
      name: "Unknown",
      avatar: "",
      isUser: false,
    };
  }

  // Since chat mock db is not synced with external auth providers
  // we set the user details from user auth state instead of thread participants
  if (message.authorId === user._id) {
    return {
      name: "Me",
      avatar: user.avatar,
      isUser: true,
    };
  }

  return {
    avatar: participant!.avatar,
    name: participant!.full_name,
    isUser: false,
  };
};

interface ChatMessagesProps {
  messages?: Message[];
  participants?: Employee[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { messages = [], participants = [], ...other } = props;
  const user = useMockedUser();

  return (
    <Stack spacing={2} sx={{ p: 3 }} {...other}>
      {messages.map((message) => {
        const author = getAuthor(message, participants, user);

        return (
          <ChatMessage
            authorAvatar={author.avatar}
            authorName={author.name}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message.id}
            position={author.isUser ? "right" : "left"}
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
