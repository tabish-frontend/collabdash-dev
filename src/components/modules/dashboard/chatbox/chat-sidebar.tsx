import type { ChangeEvent, FC } from "react";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { chatApi } from "src/api/chat";
import { useRouter } from "src/hooks/use-router";
import { useSelector } from "src/store";
import type { Employee, Thread } from "src/types";

import { ChatSidebarSearch } from "./chat-sidebar-search";
import { ChatThreadItem } from "./chat-thread-item";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { paths } from "src/constants/paths";
import { Scrollbar } from "src/utils/scrollbar";
import { employeesApi } from "src/api";
import { useDebouncedCallback } from "use-debounce";

const getThreadKey = (
  thread: Thread,
  userId: string | undefined
): string | undefined => {
  let threadKey: string | undefined;

  if (thread.type === "GROUP") {
    threadKey = thread._id;
  } else {
    const selectedThread = thread.participants?.find(
      (participant) => participant._id !== userId
    );

    threadKey = selectedThread?._id;
  }

  return threadKey;
};

const useThreads = (): { byId: Record<string, Thread>; allIds: string[] } => {
  return useSelector((state) => state.chat.threads);
};

const useCurrentThreadId = (): string | undefined => {
  return useSelector((state) => state.chat.currentThreadId);
};

interface ChatSidebarProps {
  container?: HTMLDivElement | null;
  onClose?: () => void;
  open?: boolean;
}

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { container, onClose, open, ...other } = props;
  const { user } = useAuth<AuthContextType>();

  const router = useRouter();
  const threads = useThreads();

  console.log("threads", threads);
  const currentThreadId = useCurrentThreadId();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const handleCompose = useCallback((): void => {
    router.push(paths.chat + "?compose=true");
  }, [router]);

  // Debounced version of handleSearchChange
  const debouncedHandleSearchChange = useDebouncedCallback(
    async (value: string) => {
      if (!value) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await chatApi.getContacts({ query: value });
        setSearchResults(response);
      } catch (err) {
        console.error(err);
      }
    },
    500 // Delay in ms
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchQuery(value); // Update search input value immediately
      debouncedHandleSearchChange(value); // Trigger debounced API call
    },
    [debouncedHandleSearchChange] // Ensure this stays memoized
  );

  const handleSearchClickAway = useCallback((): void => {
    if (searchFocused) {
      setSearchFocused(false);
      setSearchQuery("");
    }
  }, [searchFocused]);

  const handleSearchFocus = useCallback((): void => {
    setSearchFocused(true);
  }, []);

  const handleSearchSelect = useCallback(
    (contact: Employee): void => {
      // We use the contact ID as a thread key
      const threadKey = contact._id;

      setSearchFocused(false);
      setSearchQuery("");

      router.push(paths.chat + `?threadKey=${threadKey}`);
    },
    [router]
  );

  const handleThreadSelect = useCallback(
    (threadId: string): void => {
      console.log("handleThreadSelect threadId", threadId);
      const thread = threads.byId[threadId];

      console.log("handleThreadSelect thread", thread);

      const threadKey = getThreadKey(thread, user?._id);

      console.log("handleThreadSelect threadKey", threadKey);

      // router.push(paths.chat + `?threadKey=${threadKey}`);
      if (!threadKey) {
        router.push(paths.chat);
      } else {
        router.push(paths.chat + `?threadKey=${threadKey}`);
      }
    },
    [router, threads, user]
  );

  const content = (
    <div>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Chats
        </Typography>
        <Button
          onClick={handleCompose}
          startIcon={
            <SvgIcon>
              <PlusIcon />
            </SvgIcon>
          }
          variant="contained"
        >
          Group
        </Button>
        {!mdUp && (
          <IconButton onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        )}
      </Stack>
      <ChatSidebarSearch
        isFocused={searchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      />
      <Box sx={{ display: searchFocused ? "none" : "block" }}>
        <Scrollbar>
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              m: 0,
              p: 2,
            }}
          >
            {threads.allIds.map((threadId) => (
              <ChatThreadItem
                active={currentThreadId === threadId}
                key={threadId}
                onSelect={(): void => handleThreadSelect(threadId)}
                thread={threads.byId[threadId]}
              />
            ))}
          </Stack>
        </Scrollbar>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <Drawer
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            position: "relative",
            width: 380,
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
        {...other}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 380,
          pointerEvents: "auto",
          position: "absolute",
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
      {...other}
    >
      {content}
    </Drawer>
  );
};

ChatSidebar.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
