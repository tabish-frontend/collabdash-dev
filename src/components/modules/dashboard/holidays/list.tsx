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
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Popover,
  Stack,
  SvgIcon,
  TableBody,
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus } from "mdi-material-ui";
import { HolidayModal } from "./holiday-modal";
import { holidaysApi } from "src/api";
import { formatDate, getDayFromDate } from "src/utils/helpers";
import {
  ConfirmationModal,
  ImageAvatar,
  RouterLink,
  UserAvatarGroup,
} from "src/components/shared";
import { paths } from "src/constants/paths";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useAuth, useSettings } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { Employee } from "src/types";

const employee_Screen = ["Holiday Day", "Holiday Date", "Holiday Name"];
const HR_Screen = [
  "Holiday Day",
  "Holiday Date",
  "Holiday Name",
  "Users",
  "Action",
];

const HolidaysListComponent = () => {
  const settings = useSettings();
  const { user } = useAuth<AuthContextType>();

  const columns =
    user?.role === ROLES.Admin || user?.role === ROLES.HR
      ? HR_Screen
      : employee_Screen;

  const [holidayModal, setHolidayModal] = useState(false);
  const [holidayList, setHolidayList] = useState<any[]>([]);
  const [modalType, setModalType] = useState("");
  const [holidayValues, setHolidayValues] = useState();
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    holidayID: "",
  });

  const getHoliday = useCallback(async () => {
    let response = [];
    if (user?.role === ROLES.HR || user?.role === ROLES.Admin) {
      response = await holidaysApi.getAllUserHolidays();
    } else {
      response = await holidaysApi.getMyHolidays({ year: "2024" });
    }
    setHolidayList(response);
  }, [user?.role]); // Dependencies array ensures memoization based on user.role

  // useEffect to call getHoliday when the component mounts or when getHoliday changes
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
                    {holidayList.map((holiday, index) => {
                      return (
                        <TableRow hover role="checkbox" key={index}>
                          <TableCell align="center">
                            {getDayFromDate(holiday.date)}
                          </TableCell>

                          <TableCell align="center">
                            {formatDate(holiday.date)}
                          </TableCell>

                          <TableCell align="center">{holiday.title}</TableCell>

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
                    })}
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
