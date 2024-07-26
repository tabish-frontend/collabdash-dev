import { Tooltip } from "@mui/material";
import { SquareEditOutline } from "mdi-material-ui";
import React from "react";
import { type FC } from "react";

interface LeaveUpdateActionProps {
  handleUpdateDialog: () => void;
}

const UpdateAction: FC<LeaveUpdateActionProps> = ({ handleUpdateDialog }) => {
  return (
    <Tooltip title="Edit">
      <span>
        <SquareEditOutline
          color="success"
          sx={{ cursor: "pointer" }}
          onClick={handleUpdateDialog}
        />
      </span>
    </Tooltip>
  );
};

export default UpdateAction;
