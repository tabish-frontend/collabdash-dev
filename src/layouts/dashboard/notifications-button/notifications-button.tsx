import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Bell01Icon from "@untitled-ui/icons-react/build/esm/Bell01";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";

import { usePopover } from "src/hooks/use-popover";

import { NotificationsPopover } from "./notifications-popover";
import { useNotifications } from "src/hooks/use-notifications";

export const NotificationsButton: FC = () => {
  const popover = usePopover<HTMLButtonElement>();

  const { notifications, unreadCount, markAllAsRead, removeNotification } =
    useNotifications();

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton ref={popover.anchorRef} onClick={popover.handleOpen}>
          <Badge color="error" badgeContent={unreadCount}>
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
        onMarkAllAsRead={markAllAsRead}
        onRemoveOne={() => {}}
        open={popover.open}
      />
    </>
  );
};
