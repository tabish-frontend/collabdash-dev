// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import {
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
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
import { ImageAvatar } from "src/components/shared";
import { paths } from "src/constants/paths";
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

  const getHoliday = async () => {
    let response = [];
    if (user?.role === ROLES.HR || user?.role === ROLES.Admin) {
      response = await holidaysApi.getAllUserHolidays();
    } else {
      response = await holidaysApi.getMyHolidays({ year: "2024" });
    }
    setHolidayList(response);
  };

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

  useEffect(() => {
    getHoliday();
  }, []);

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
            <Typography variant="h4">Holiday's</Typography>

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
                      let userAvatar = [];

                      if (
                        user?.role === ROLES.Admin ||
                        user?.role === ROLES.HR
                      ) {
                        userAvatar = holiday.users.map((user: any) => {
                          return (
                            <Tooltip key={user._id} title={user.full_name}>
                              <span>
                                <Link
                                  key={user._id}
                                  href={`${paths.employees}/${user.username}`}
                                  variant="subtitle2"
                                >
                                  <ImageAvatar
                                    path={user.avatar || ""}
                                    alt="user image"
                                    width={40}
                                    height={40}
                                  />
                                </Link>
                              </span>
                            </Tooltip>
                          );
                        });
                      }

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
                                <AvatarGroup
                                  max={3}
                                  style={{
                                    cursor: "pointer",
                                    justifyContent: "center",
                                  }}
                                >
                                  {userAvatar}
                                </AvatarGroup>
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
                                    onClick={() => deleteHoliday(holiday._id)}
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
    </Box>
  );
};

const HolidaysList: NextPage = () => {
  return <HolidaysListComponent />;
};

HolidaysList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { HolidaysList };
