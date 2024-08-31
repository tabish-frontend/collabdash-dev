import type { FC } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { AuthContextType } from "src/contexts/auth";
import { useAuth } from "src/hooks/use-auth";
import { ImageAvatar } from "src/components/shared";

export const AccountButton: FC = () => {
  const popover = usePopover<HTMLButtonElement>();
  const { user } = useAuth<AuthContextType>();

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "divider",
          height: 40,
          width: 40,
          borderRadius: "50%",
        }}
      >
        <ImageAvatar
          path={user?.avatar || ""}
          alt="user prfile"
          width={40}
          height={40}
        />
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
