import { IconButton, Stack, TableCell, Tooltip } from "@mui/material";
import { CheckCircleOutline, CloseCircleOutline } from "mdi-material-ui";
import { LeavesStatus } from "src/constants/status";
import { type FC } from "react";
import React from "react";

interface LeavesStatusProps {
  leaveId: string;
  leaveStatus: any;
  handleUpdateStatus: (id: string, status: any) => void;
}

const UpdateLeavesStatus: FC<LeavesStatusProps> = ({
  leaveId,
  leaveStatus,
  handleUpdateStatus,
}) => {
  return (
    <TableCell>
      <Stack direction={"row"} width={150}>
        <Tooltip title="Approved">
          <span>
            <IconButton
              onClick={() => handleUpdateStatus(leaveId, LeavesStatus.Approved)}
              disabled={leaveStatus === LeavesStatus.Approved}
              sx={{
                "&:hover": {
                  backgroundColor: "green",
                  color: "white",
                },
                color: "green",
              }}
            >
              <CheckCircleOutline />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Rejected">
          <span>
            <IconButton
              onClick={() => handleUpdateStatus(leaveId, LeavesStatus.Rejected)}
              disabled={leaveStatus === LeavesStatus.Rejected}
              sx={{
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
                color: "red",
              }}
            >
              <CloseCircleOutline />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </TableCell>
  );
};

export default UpdateLeavesStatus;
