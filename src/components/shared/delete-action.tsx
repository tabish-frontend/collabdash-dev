import { Tooltip } from "@mui/material";
import { TrashCanOutline } from "mdi-material-ui";
import { type FC } from "react";
import React from "react";

interface LeaveDelteActionProps {
  handleDeleteDialog: () => void;
}

const DeleteAction: FC<LeaveDelteActionProps> = ({ handleDeleteDialog }) => {
  return (
    <Tooltip title="Delete">
      <span>
        <TrashCanOutline
          color="error"
          sx={{ cursor: "pointer" }}
          onClick={handleDeleteDialog}
        />
      </span>
    </Tooltip>
  );
};

export default DeleteAction;
