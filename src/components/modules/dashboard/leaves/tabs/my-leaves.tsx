// ** MUI Imports
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import { formatDate } from "src/utils/helpers";
import { NoRecordFound } from "src/components/shared";
import { Scrollbar } from "src/utils/scrollbar";
import UpdateAction from "src/components/shared/update-action";
import DeleteAction from "src/components/shared/delete-action";

const HeaderColumns = [
  "Applied Date",
  "Leave Type",
  "Leave From",
  "Leave To",
  "Reason",
  "Status",
  "Action",
];

interface MyLeavesProps {
  leavesList: any;
  isLoading: boolean;
  LeaveDialog: any;
  DeleteLeaveDialog: any;
}

export const MyLeaves: React.FC<MyLeavesProps> = ({
  leavesList,
  isLoading,
  LeaveDialog,
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
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        spacing={1}
                      >
                        <UpdateAction
                          handleUpdateDialog={() =>
                            LeaveDialog.handleOpen({
                              type: "update",
                              isEmployee: true,
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
