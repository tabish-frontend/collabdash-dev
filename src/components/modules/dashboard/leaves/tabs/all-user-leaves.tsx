// ** MUI Imports
import {
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { ImageAvatar, NoRecordFound, RouterLink } from "src/components/shared";
import { React } from "mdi-material-ui";
import { formatDate } from "src/utils";
import UpdateAction from "src/components/shared/update-action";
import { Scrollbar } from "src/utils/scrollbar";
import { paths } from "src/constants/paths";
import UpdateLeavesStatus from "src/components/shared/leaves-status";
import DeleteAction from "src/components/shared/delete-action";

const HeaderColumns = [
  "Employee Name",
  "Applied Date",
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Manage Leave",
  "Action",
];

interface AllUserLeavesProps {
  leavesList: any;
  isLoading: boolean;
  LeaveDialog: any;
  handleUpdateStatus: any;
  DeleteLeaveDialog: any;
}

export const AllUserLeaves: React.FC<AllUserLeavesProps> = ({
  leavesList,
  isLoading,
  LeaveDialog,
  handleUpdateStatus,
  DeleteLeaveDialog,
}) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Scrollbar sx={{ maxHeight: 470 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {HeaderColumns.map((column, index) => (
                <TableCell key={index}>
                  <span style={{ fontWeight: 700 }}>{column}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {HeaderColumns.map((col, colIndex) => (
                    <TableCell key={colIndex} align="center" width={150}>
                      <Skeleton variant="rounded" width="100%" height={25} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : leavesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={HeaderColumns.length}>
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            ) : (
              leavesList.map((leave: any, index: number) => {
                return (
                  <TableRow hover role="checkbox" key={index}>
                    <TableCell>
                      <Stack
                        alignItems={"center"}
                        direction={"row"}
                        justifyContent={"center"}
                        spacing={1}
                        width={150}
                      >
                        <ImageAvatar
                          path={leave.user.avatar || ""}
                          alt="user image"
                          width={40}
                          height={40}
                        />

                        <Link
                          color="inherit"
                          component={RouterLink}
                          href={`${paths.employees}/${leave.user.username}`}
                          variant="subtitle2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {leave.user.full_name}
                        </Link>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography width={150}>
                        {formatDate(leave.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography width={100}>{leave.leave_type}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography width={150}>
                        {formatDate(leave.startDate)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography width={150}>
                        {formatDate(leave.endDate)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip
                        arrow
                        title={<Typography>{leave.reason}</Typography>}
                      >
                        <Typography width={200} noWrap>
                          {leave.reason}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Typography>{leave.status.toUpperCase()}</Typography>
                    </TableCell>

                    <TableCell>
                      <UpdateLeavesStatus
                        handleUpdateStatus={handleUpdateStatus}
                        leaveId={leave._id}
                        leaveStatus={leave.status}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        spacing={1}
                      >
                        <UpdateAction
                          handleUpdateDialog={() =>
                            LeaveDialog.handleOpen({
                              type: "update",
                              isEmployee: false,
                              values: leave,
                            })
                          }
                        />

                        <DeleteAction
                          handleDeleteDialog={() =>
                            DeleteLeaveDialog.handleOpen({
                              id: leave._id,
                            })
                          }
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};
