import {
  Link,
  Paper,
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
import { RouterLink } from "src/components/shared";
import { paths } from "src/constants/paths";
import { CellValues } from "../helper";

export const MonthViewAttendance = ({ employeesAttendance, filters }: any) => {
  return (
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
            {[...Array(31)].map((_, index) => (
              <TableCell key={index + 1}>
                <Typography variant="caption">{index + 1}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {!employeesAttendance ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="h6">Loading....</Typography>
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
                    backgroundColor: "white",
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

                {[...Array(31)].map((_, index) => {
                  const date = new Date(
                    filters.year,
                    filters.month - 1,
                    index + 1
                  );

                  const attendanceValues = CellValues(item, date);

                  return (
                    <TableCell
                      key={index}
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
    </TableContainer>
  );
};
