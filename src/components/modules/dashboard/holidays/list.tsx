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
  Select,
  Skeleton,
  Stack,
  SvgIcon,
  TableBody,
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
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";

const employee_Screen = ["Holiday Day", "Holiday Date", "Holiday Name"];
const HR_Screen = [
  "Holiday Day",
  "Holiday Date",
  "Holiday Name",
  "Users",
  "Action",
];

const HolidaysListComponent = () => {
  const currentYear = new Date().getFullYear();

  // Create an array of the last 4 years
  const lastFourYears = Array.from(
    { length: 4 },
    (_, index) => currentYear - index
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  const settings = useSettings();
  const theme = useTheme();
  const { user } = useAuth<AuthContextType>();

  const columns =
    user?.role === ROLES.Admin || user?.role === ROLES.HR
      ? HR_Screen
      : employee_Screen;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [holidayModal, setHolidayModal] = useState(false);
  const [holidayList, setHolidayList] = useState<any[]>([]);
  const [modalType, setModalType] = useState("");
  const [holidayValues, setHolidayValues] = useState();
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    holidayID: "",
  });

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

  const addAndUpdateHoliday = async (values: any) => {
    const { _id, ...HolidayValues } = values;

    if (modalType === "update") {
      await holidaysApi.updateHoliday(_id, HolidayValues);
    } else {
      await holidaysApi.addHoliday(HolidayValues);
    }
    getHoliday();
    setHolidayModal(false);
    setHolidayValues(undefined);
  };

  const deleteHoliday = async (_id: string) => {
    await holidaysApi.deleteHoliday(_id);
    setHolidayList((prevList) =>
      prevList.filter((holiday) => holiday._id !== _id)
    );
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                  setHolidayModal(true);
                  setModalType("create");
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
            <CardHeader
              action={
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    label="Year"
                  >
                    {lastFourYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            />
            <CardContent>
              <TableContainer sx={{ maxHeight: 440 }}>
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
                            <TableCell align="center">
                              {getDayFromDate(holiday.date)}
                            </TableCell>

                            <TableCell align="center">
                              {formatDate(holiday.date)}
                            </TableCell>

                            <TableCell align="center">
                              {holiday.title}
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
                                  >
                                    <SquareEditOutline
                                      color="success"
                                      sx={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setModalType("update");
                                        setHolidayModal(true);
                                        setHolidayValues(holiday);
                                      }}
                                    />
                                    <TrashCanOutline
                                      color="error"
                                      sx={{ cursor: "pointer" }}
                                      onClick={() =>
                                        setDeleteModal({
                                          open: true,
                                          holidayID: holiday._id,
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
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {holidayModal && (
        <HolidayModal
          holidayValues={holidayValues}
          modalType={modalType}
          modal={holidayModal}
          onCancel={() => {
            setHolidayValues(undefined);
            setHolidayModal(false);
          }}
          onConfirm={addAndUpdateHoliday}
        />
      )}

      {deleteModal.open && (
        <ConfirmationModal
          warning_title={"Delete"}
          warning_text={"Are you sure you want to delete the Holiday ?"}
          button_text={"Delete"}
          modal={deleteModal.open}
          onCancel={() =>
            setDeleteModal({
              open: false,
              holidayID: "",
            })
          }
          onConfirm={async () => {
            deleteHoliday(deleteModal.holidayID);
            setDeleteModal({
              open: false,
              holidayID: "",
            });
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
