import type { FC } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import Mail04Icon from "@untitled-ui/icons-react/build/esm/Mail04";
import MessageChatSquareIcon from "@untitled-ui/icons-react/build/esm/MessageChatSquare";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/utils/scrollbar";

import type { Notification } from "./notifications";
import { getDay_Time } from "src/utils";

const renderContent = (notification: Notification): JSX.Element | null => {
  const createdAt = format(notification.createdAt, "MMM dd, h:mm a");

  const formatMessageWithLink = (
    message: string,
    linkText: string,
    time: Date | null | undefined
  ): React.ReactNode => {
    const parts = message.split(linkText);

    if (!time || !(time instanceof Date) || isNaN(time.getTime())) {
      if (parts.length === 2) {
        return (
          <>
            {parts[0]}
            <Link
              href={`/tasks/${linkText}`}
              style={{ textDecoration: "underline", fontWeight: "bold" }}
            >
              {linkText}
            </Link>
            {parts[1]}
          </>
        );
      }

      // If the linkText is not found, return the message as is
      return message;
    }

    // If time is valid, format it and proceed with the existing logic
    const formattedTime = getDay_Time(time); // Get formatted time from getDay_Time
    const isoTime = time.toISOString();
    const regex = new RegExp(
      isoTime.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g"
    ); // Escape special characters

    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <Link
            href={`/tasks/${linkText}`}
            style={{ textDecoration: "underline", fontWeight: "bold" }}
          >
            {linkText}
          </Link>
          {parts[1].replace(regex, formattedTime)}
        </>
      );
    }

    // If the linkText is not found, just replace the time in the whole message
    return message.replace(regex, formattedTime);
  };

  return (
    <>
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Avatar src={notification.sender.avatar}>
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ mr: 0.5 }} variant="subtitle2">
              {notification.sender.fullName}{" "}
              <Box component="span" sx={{ fontSize: "inherit" }}>
                {formatMessageWithLink(
                  notification.message,
                  notification.link,
                  notification.time
                )}
              </Box>
            </Typography>
          </Box>
        }
        secondary={
          <Typography color="text.secondary" variant="caption">
            {createdAt}
          </Typography>
        }
        sx={{ my: 0 }}
      />
    </>
  );
};

interface NotificationsPopoverProps {
  anchorEl: null | Element;
  notifications: Notification[];
  onClose?: () => void;
  onMarkAllAsRead?: () => void;
  onRemoveOne?: (id: string) => void;
  open?: boolean;
}

export const NotificationsPopover: FC<NotificationsPopoverProps> = (props) => {
  const {
    anchorEl,
    notifications,
    onClose,
    onMarkAllAsRead,
    onRemoveOne,
    open = false,
    ...other
  } = props;

  const isEmpty = notifications.length === 0;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 380 } }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          Notifications
        </Typography>
        <Tooltip title="Mark all as read">
          <IconButton onClick={onMarkAllAsRead} size="small" color="inherit">
            <SvgIcon>
              <Mail04Icon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Stack>
      {isEmpty ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">
            There are no notifications
          </Typography>
        </Box>
      ) : (
        <Scrollbar sx={{ maxHeight: 400 }}>
          <List disablePadding>
            {notifications.map((notification) => (
              <ListItem
                divider
                key={notification.id}
                sx={{
                  alignItems: "flex-start",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  "& .MuiListItemSecondaryAction-root": {
                    top: "24%",
                  },
                }}
                secondaryAction={
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveOne?.(notification.id)}
                      size="small"
                    >
                      <SvgIcon>
                        <XIcon />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                }
              >
                {renderContent(notification)}
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      )}
    </Popover>
  );
};

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onMarkAllAsRead: PropTypes.func,
  onRemoveOne: PropTypes.func,
  open: PropTypes.bool,
};
