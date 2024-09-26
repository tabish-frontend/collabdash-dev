import { useCallback, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Menu01Icon from "@untitled-ui/icons-react/build/esm/Menu01";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { useSearchParams } from "src/hooks/use-search-params";
import { DashboardLayout } from "src/layouts/dashboard";
import { useDispatch } from "src/store";
import { thunks } from "src/thunks/chat";
import { ChatBlank } from "./chat-blank";
import { ChatComposer } from "./chat-composer";
import { ChatThread } from "./chat-thread";
import { ChatContainer } from "./chat-container";
import { ChatSidebar } from "./chat-sidebar";
import useListenMessages from "src/hooks/use-listen-messages";

/**
 * NOTE:
 * In our case there two possible routes
 * one that contains /chat and one with a chat?threadKey={{threadKey}}
 * if threadKey does not exist, it means that the chat is in compose mode
 */

const useThreads = (): void => {
  const dispatch = useDispatch();

  const handleThreadsGet = useCallback((): void => {
    dispatch(thunks.getThreads());
  }, [dispatch]);

  useEffect(
    () => {
      handleThreadsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

const useSidebar = () => {
  const searchParams = useSearchParams();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback((): void => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(
    () => {
      handleScreenResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mdUp]
  );

  const handeParamsUpdate = useCallback((): void => {
    if (!mdUp) {
      setOpen(false);
    }
  }, [mdUp]);

  useEffect(
    () => {
      handeParamsUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const handleToggle = useCallback((): void => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
  };
};

const ChatboxComponent = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get("compose") === "true";
  const threadKey = searchParams.get("threadKey") || undefined;

  const sidebar = useSidebar();

  useThreads();

  const view = threadKey ? "thread" : compose ? "compose" : "blank";

  useListenMessages();

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <ChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
          />
          <ChatContainer open={sidebar.open}>
            <Box sx={{ p: 2 }}>
              <IconButton onClick={sidebar.handleToggle}>
                <SvgIcon>
                  <Menu01Icon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Divider />
            {view === "thread" && <ChatThread threadKey={threadKey!} />}
            {view === "compose" && <ChatComposer />}
            {view === "blank" && <ChatBlank />}
          </ChatContainer>
        </Box>
      </Box>
    </>
  );
};

const Chatbox: NextPage = () => {
  return <ChatboxComponent />;
};

Chatbox.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Chatbox };
