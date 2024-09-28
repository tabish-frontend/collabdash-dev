import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Bell01Icon from "@untitled-ui/icons-react/build/esm/Bell01";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";

import { usePopover } from "src/hooks/use-popover";

import { NotificationsPopover } from "./notifications-popover";
import { Notification } from "src/types";
import { notificationsApi } from "src/api";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    const response = await notificationsApi.getNotifications();
    setNotifications(response);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unread = useMemo((): number => {
    return notifications.reduce(
      (acc, notification) => acc + (notification.read ? 0 : 1),
      0
    );
  }, [notifications]);

  const handleRemoveOne = useCallback((notificationId: string): void => {
    setNotifications((prevState) => {
      return prevState.filter(
        (notification) => notification._id !== notificationId
      );
    });
  }, []);

  const handleMarkAllAsRead = useCallback((): void => {
    setNotifications((prevState) => {
      return prevState.map((notification) => ({
        ...notification,
        read: true,
      }));
    });
  }, []);

  return {
    handleMarkAllAsRead,
    handleRemoveOne,
    notifications,
    unread,
  };
};

export const NotificationsButton: FC = () => {
  const popover = usePopover<HTMLButtonElement>();
  const { handleRemoveOne, handleMarkAllAsRead, notifications, unread } =
    useNotifications();

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton ref={popover.anchorRef} onClick={popover.handleOpen}>
          <Badge color="error" badgeContent={unread}>
            <SvgIcon>
              <Bell01Icon />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        notifications={notifications}
        onClose={popover.handleClose}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRemoveOne={handleRemoveOne}
        open={popover.open}
      />
    </>
  );
};
