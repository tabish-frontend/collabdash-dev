import type { FC, MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import type SimpleBarCore from "simplebar-core";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { chatApi } from "src/api/chat";
import { useRouter } from "src/hooks/use-router";
import { useDispatch, useSelector } from "src/store";
import { thunks } from "src/thunks/chat";
import type { Participant, Thread } from "src/types";

import { ChatMessageAdd } from "./chat-message-add";
import { ChatMessages } from "./chat-messages";
import { ChatThreadToolbar } from "./chat-thread-toolbar";
import { paths } from "src/constants/paths";

import { Scrollbar } from "src/utils/scrollbar";

const useParticipants = (threadKey: string): Participant[] => {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleParticipantsGet = useCallback(async (): Promise<void> => {
    try {
      const participants = await chatApi.getParticipants({ threadKey });

      console.log("participants", participants);
      setParticipants(participants);
    } catch (err) {
      console.error(err);
      router.push(paths.chat);
    }
  }, [router, threadKey]);

  useEffect(
    () => {
      handleParticipantsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]
  );

  return participants;
};

const useThread = (threadKey: string): Thread | undefined => {
  const router = useRouter();
  const dispatch = useDispatch();
  const thread = useSelector((state) => {
    const { threads, currentThreadId } = state.chat;

    return threads.byId[currentThreadId as string];
  });

  const handleThreadGet = useCallback(async (): Promise<void> => {
    // If thread key is not a valid key (thread id or contact id)
    // the server throws an error, this means that the user tried a shady route
    // and we redirect them on the home view

    let threadId: string | undefined;

    try {
      threadId = (await dispatch(
        thunks.getThread({
          threadKey,
        })
      )) as unknown as string | undefined;
    } catch (err) {
      console.error("ERROR", err);
      router.push(paths.chat);
      return;
    }

    // Set the active thread
    // If the thread exists, then is sets it as active, otherwise it sets is as undefined

    dispatch(
      thunks.setCurrentThread({
        threadId,
      })
    );

    // Mark the thread as seen only if it exists

    if (threadId) {
      dispatch(
        thunks.markThreadAsSeen({
          threadId,
        })
      );
    }
  }, [dispatch, threadKey, router]);

  useEffect(
    () => {
      handleThreadGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]
  );

  return thread;
};

const useMessagesScroll = (
  thread?: Thread
): {
  messagesRef: MutableRefObject<SimpleBarCore | null>;
} => {
  const messagesRef = useRef<SimpleBarCore | null>(null);

  const handleUpdate = useCallback((): void => {
    // Thread does not exist
    if (!thread) {
      return;
    }

    // Ref is not used
    if (!messagesRef.current) {
      return;
    }

    const container = messagesRef.current;
    const scrollElement = container!.getScrollElement();

    if (scrollElement) {
      scrollElement.scrollTop = container.el.scrollHeight;
    }
  }, [thread]);

  useEffect(
    () => {
      handleUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [thread]
  );

  return {
    messagesRef,
  };
};

interface ChatThreadProps {
  threadKey: string;
}

export const ChatThread: FC<ChatThreadProps> = (props) => {
  const { threadKey, ...other } = props;

  const dispatch = useDispatch();
  const thread = useThread(threadKey);

  const participants = useParticipants(threadKey);

  console.log("participants ", participants);
  const { messagesRef } = useMessagesScroll(thread);

  const handleSend = useCallback(
    async (body: string, contentType: string = "text"): Promise<void> => {
      // If we have the thread, we use its ID to add a new message

      const recipientIds = participants.map(
        (participant) => participant._id as string
      );

      if (thread) {
        try {
          await dispatch(
            thunks.addMessage({
              threadId: thread._id,
              body,
              recipientIds,
              contentType,
              attachments: [],
            })
          );
        } catch (err) {
          console.error(err);
        }

        return;
      }

      let threadId: string;

      try {
        threadId = (await dispatch(
          thunks.addMessage({
            recipientIds,
            body,
            contentType: "text",
            attachments: [],
          })
        )) as unknown as string;
      } catch (err) {
        console.error(err);
        return;
      }

      // Load the thread because we did not have it

      try {
        await dispatch(
          thunks.getThread({
            threadKey: threadId,
          })
        );
      } catch (err) {
        console.error(err);
        return;
      }

      // Set the new thread as active

      dispatch(thunks.setCurrentThread({ threadId }));
    },
    [dispatch, participants, thread]
  );

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: "hidden",
      }}
      {...other}
    >
      <ChatThreadToolbar
        participants={participants}
        threadKey={threadKey}
        onSend={handleSend}
      />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Scrollbar ref={messagesRef} sx={{ maxHeight: "100%" }}>
          <ChatMessages
            messages={thread?.messages || []}
            participants={thread?.participants || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd onSend={handleSend} />
    </Stack>
  );
};

ChatThread.propTypes = {
  threadKey: PropTypes.string.isRequired,
};
