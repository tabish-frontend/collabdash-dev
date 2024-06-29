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
  useTheme,
} from "@mui/material";
import { RouterLink, Scrollbar } from "src/components/shared";
import { paths } from "src/constants/paths";
import { CellValues } from "../helper";
import dayjs from "dayjs";
import NoRecordFound from "src/components/shared/NoRecordFound";

export const MonthViewAttendance = ({
  employeesAttendance,
  filters,
  isLoading,
}: any) => {
  const daysInMonth = dayjs(filters.date).daysInMonth();
  const theme = useTheme();

  return (
    <Scrollbar sx={{ maxHeight: 600, overflowY: "auto" }}>
      
      {!isLoading ? (
        [...Array(5)].map((_, index) => (
          <Stack direction={"row"} spacing={5} key={`skeleton-${index}`}>
            <Skeleton
              variant="rounded"
              width={300}
              height={25}
              sx={{ mb: "10px" }}
            />

            {[...Array(daysInMonth)].map((_, dayIndex) => (
              
               
                  <Skeleton variant="rounded" width={20} height={12} />
              
             
            ))}
              
          </Stack>
        ))
      ) : (
        <></>
      )}

      {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                }}
              >
                Employee
              </TableCell>
              {[...Array(daysInMonth)].map((_, index) => (
                <TableCell key={`header-${index + 1}`}>
                  <Typography variant="caption">{index + 1}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="rounded" width={150} height={25} />
                  </TableCell>
                  {[...Array(daysInMonth)].map((_, dayIndex) => (
                    <TableCell key={`skeleton-day-${dayIndex}`}>
                      <Skeleton variant="rounded" width="100%" height={25} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : employeesAttendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={daysInMonth}>
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            ) : (
              employeesAttendance.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      p: 1,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Stack direction="row" spacing={1} width={170}>
                      <Link
                        color="inherit"
                        component={RouterLink}
                        href={`${paths.employees}/${item.username}`}
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {item.full_name}
                      </Link>
                    </Stack>
                  </TableCell>

                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const date = dayjs(filters.date)
                      .set("date", dayIndex + 1)
                      .toDate();

                    const attendanceValues = CellValues(item, date);

                    return (
                      <TableCell
                        key={`attendance-${index}-${dayIndex}`}
                        sx={{ p: 0, cursor: "pointer" }}
                        align="center"
                      >
                        <Tooltip title={attendanceValues?.tooltip} arrow>
                          <span>{attendanceValues.icon}</span>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Scrollbar>
  );
};
