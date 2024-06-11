import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { roles } from "src/constants";
import SvgIcon from "@mui/material/SvgIcon";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

interface CreateButtonProps {
  button_text?: string;
  handleClick?: () => void;
  permission_access?: boolean;
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  button_text,
  handleClick,
  permission_access,
}) => {
  return (
    <Tooltip
      title={
        !permission_access
          ? "You do not have permission to perform this aciton"
          : ""
      }
    >
      <span>
        <Button
          variant="contained"
          disabled={!permission_access}
          onClick={handleClick}
          startIcon={
            <SvgIcon>
              <PlusIcon />
            </SvgIcon>
          }
        >
          {button_text}
        </Button>
      </span>
    </Tooltip>
  );
};
