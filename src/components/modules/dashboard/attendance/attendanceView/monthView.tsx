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

export const MonthViewAttendance = ({
  employeesAttendance,
  filters,
  isLoading,
}: any) => {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(filters.month, filters.year);
  const theme = useTheme();

  return (
    <Scrollbar sx={{ maxHeight: 480, overflowY: "auto" }}>
      <TableContainer component={Paper}>
        <Table aria-label="attendance table">
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
            {isLoading
              ? [...Array(5)].map((_, index) => (
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
              : employeesAttendance.map((item: any, index: number) => (
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
                      const date = new Date(
                        filters.year,
                        filters.month - 1,
                        dayIndex + 1
                      );

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
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};
