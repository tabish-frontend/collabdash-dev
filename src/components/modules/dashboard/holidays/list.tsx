// ** MUI Imports
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  SvgIcon,
  TableBody,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Plus } from "mdi-material-ui";
import { HolidayModal } from "./holiday-modal";
import { holidaysApi } from "src/api";
import { formatDate, getDayFromDate } from "src/utils/helpers";
import {
  ConfirmationModal,
  NoRecordFound,
  UserAvatarGroup,
} from "src/components/shared";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useAuth, useDialog, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { Scrollbar } from "src/utils/scrollbar";
import UpdateAction from "src/components/shared/update-action";
import DeleteAction from "src/components/shared/delete-action";

const employee_Screen = ["Holiday Day", "Holiday Date", "Holiday Name"];
const HR_Screen = [
  "Holiday Day",
  "Holiday Date",
  "Holiday Name",
  "Users",
  "Action",
];

interface HolidayDialogData {
  type: string;
  values?: object;
}

interface DeletHolidayDialogData {
  id: string;
}

const HolidaysListComponent = () => {
  const currentYear = new Date().getFullYear();

  const lastFourYears = Array.from(
    { length: 4 },
    (_, index) => currentYear - index
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  const settings = useSettings();
  const { user } = useAuth<AuthContextType>();

  const columns =
    user?.role === ROLES.Admin || user?.role === ROLES.HR
      ? HR_Screen
      : employee_Screen;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [holidayList, setHolidayList] = useState<any[]>([]);

  const getHoliday = useCallback(async () => {
    setIsLoading(true);
    let response = [];
    if (user?.role === ROLES.HR || user?.role === ROLES.Admin) {
      response = await holidaysApi.getAllUserHolidays(selectedYear);
    } else {
      response = await holidaysApi.getMyHolidays(selectedYear);
    }
    setHolidayList(response);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    getHoliday();
  }, [getHoliday]);

  const HolidayDialog = useDialog<HolidayDialogData>();
  const DeleteHolidayDialog = useDialog<DeletHolidayDialogData>();

  const addAndUpdateHoliday = async (values: any) => {
    const { _id, ...HolidayValues } = values;

    if (HolidayDialog.data?.type === "update") {
      await holidaysApi.updateHoliday(_id, HolidayValues);
    } else {
      await holidaysApi.addHoliday(HolidayValues);
    }
    getHoliday();
    HolidayDialog.handleClose();
  };

  const deleteHoliday = async (_id: string | undefined) => {
    if (!_id) return null;
    await holidaysApi.deleteHoliday(_id);
    setHolidayList((prevList) =>
      prevList.filter((holiday) => holiday._id !== _id)
    );
    DeleteHolidayDialog.handleClose();
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Stack direction={"row"} justifyContent="space-between" spacing={4}>
            <Typography variant="h4">{"Holiday's"}</Typography>

            {(user?.role === ROLES.Admin || user?.role === ROLES.HR) && (
              <Button
                onClick={() => {
                  HolidayDialog.handleOpen({
                    type: "create",
                  });
                }}
                startIcon={
                  <SvgIcon>
                    <Plus />
                  </SvgIcon>
                }
                variant="contained"
              >
                Add Holiday
              </Button>
            )}
          </Stack>
          <Card>
            <CardContent>
              <Stack direction={"row"} justifyContent={"flex-end"} mb={2}>
                <TextField
                  select
                  label="Select Year"
                  sx={{ width: 150, height: 50 }}
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {lastFourYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Scrollbar sx={{ maxHeight: 470 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column, index) => (
                          <TableCell
                            key={index}
                            align="center"
                            sx={{ fontSize: 700 }}
                          >
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        [...Array(5)].map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            {columns.map((col, colIndex) => (
                              <TableCell key={colIndex} align="center">
                                <Skeleton
                                  variant="rounded"
                                  width="100%"
                                  height={25}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : holidayList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            <NoRecordFound />
                          </TableCell>
                        </TableRow>
                      ) : (
                        holidayList.map((holiday, index) => {
                          return (
                            <TableRow hover role="checkbox" key={index}>
                              <TableCell align="center" width={100}>
                                <Typography width={100}>
                                  {getDayFromDate(holiday.date)}
                                </Typography>
                              </TableCell>

                              <TableCell align="center">
                                <Typography minWidth={150}>
                                  {formatDate(holiday.date)}
                                </Typography>
                              </TableCell>

                              <TableCell align="center" width={150}>
                                <Typography width={150}>
                                  {holiday.title}
                                </Typography>
                              </TableCell>

                              {(user?.role === ROLES.Admin ||
                                user?.role === ROLES.HR) && (
                                <>
                                  <TableCell align="center">
                                    <UserAvatarGroup users={holiday.users} />
                                  </TableCell>

                                  <TableCell align="center">
                                    <Stack
                                      justifyContent={"center"}
                                      direction={"row"}
                                      spacing={2}
                                    >
                                      <UpdateAction
                                        handleUpdateDialog={() =>
                                          HolidayDialog.handleOpen({
                                            type: "update",
                                            values: holiday,
                                          })
                                        }
                                      />
                                      <DeleteAction
                                        handleDeleteDialog={() =>
                                          DeleteHolidayDialog.handleOpen({
                                            id: holiday._id,
                                          })
                                        }
                                      />
                                    </Stack>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {HolidayDialog.open && (
        <HolidayModal
          holidayValues={HolidayDialog.data?.values}
          modalType={HolidayDialog.data?.type}
          modal={HolidayDialog.open}
          onCancel={HolidayDialog.handleClose}
          onConfirm={addAndUpdateHoliday}
        />
      )}

      {DeleteHolidayDialog.open && (
        <ConfirmationModal
          modal={DeleteHolidayDialog.open}
          onCancel={DeleteHolidayDialog.handleClose}
          onConfirm={() => deleteHoliday(DeleteHolidayDialog.data?.id)}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete the Holiday ?",
          }}
        />
      )}
    </Box>
  );
};

const HolidaysList: NextPage = () => {
  return <HolidaysListComponent />;
};

HolidaysList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { HolidaysList };
