import {
  Avatar,
  AvatarGroup,
  Link,
  Popover,
  Tooltip,
  Box,
  Stack,
} from "@mui/material";
import { Employee } from "src/types";
import { ImageAvatar } from "./image-avatar";
import { RouterLink } from "./router-link";
import { paths } from "src/constants/paths";
import { useState } from "react";
import { UsersListPopover } from "./lists";

export const UserAvatarGroup = ({ users }: { users: Employee[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverToggle = (
    event: React.MouseEvent<HTMLElement>,
    open: boolean
  ) => {
    setAnchorEl(open ? event.currentTarget : null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "user-popover" : undefined;

  const renderUserAvatars = users.slice(0, 2).map((user, index) => (
    <Tooltip key={index} title={user.full_name}>
      <Link
        component={RouterLink}
        href={`${paths.employees}/${user.username}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ImageAvatar
          path={user.avatar || ""}
          alt={user.full_name}
          width={40}
          height={40}
        />
      </Link>
    </Tooltip>
  ));

  const remainingUsers = users.length > 2 && (
    <Box
      onClick={(event) => {
        event.stopPropagation();
        handlePopoverToggle(event, true);
      }}
      style={{ cursor: "pointer", marginLeft: "8px", fontWeight: 600 }}
    >
      +{users.length - 2}
    </Box>
  );

  return (
    <>
      <AvatarGroup style={{ justifyContent: "center" }}>
        <Stack direction={"row"} alignItems={"center"}>
          {renderUserAvatars}
          {remainingUsers}
        </Stack>
      </AvatarGroup>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={(event: any) => {
          event.stopPropagation();
          handlePopoverToggle(event, false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <UsersListPopover users={users.slice(2)} />
      </Popover>
    </>
  );
};
