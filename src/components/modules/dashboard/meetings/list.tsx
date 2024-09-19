import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";
import { useAuth, useDialog, useSettings } from "src/hooks";
import { DashboardLayout } from "src/layouts";
import { ROLES } from "src/constants/roles";
import { AuthContextType } from "src/contexts/auth";
import { Plus } from "mdi-material-ui";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { MeetingStatus } from "src/constants/status";
import { Scrollbar } from "src/utils/scrollbar";
import { MeetingCard } from "src/components/modules/dashboard/meetings/meetingCard";
import { ConfirmationModal, NoRecordFound } from "src/components/shared";
import { MeetingModal } from "src/components/modules/dashboard/meetings/meeting-modal";
import { Meeting } from "src/types";
import { meetingInitialValues } from "src/formik";
import { meetingApi } from "src/api";

interface MeetingDialogData {
  type: string;
  values?: Meeting;
}

interface DeleteMeetingDialogData {
  _id?: string;
  title: string;
}

const MeetingListComponent = () => {
  const settings = useSettings();
  const { user } = useAuth<AuthContextType>();
  const theme = useTheme();

  const meetingDialog = useDialog<MeetingDialogData>();
  const DeleteMeetingDialog = useDialog<DeleteMeetingDialogData>();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoading, setIsLoading] = useState(false);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [meetingStatus, setMeetingStatus] = useState<string>("upcoming");

  const getMeetins = useCallback(async () => {
    setIsLoading(true);
    const response = await meetingApi.getAllMeetings(meetingStatus);
    setMeetingList(response.data);
    setIsLoading(false);
  }, [meetingStatus]);

  const createAndUpdateMeeting = async (values: Meeting) => {
    const { _id, ...meetingValues } = values;

    console.log("meetingValues", meetingValues);

    if (meetingDialog.data?.type === "Update") {
      // await holidaysApi.updateHoliday(_id, HolidayValues);
    } else {
      const response = await meetingApi.createMeeting(meetingValues);
      // setMeetingList((prev) => (
      //   {...prev,
      //     response.data
      //   }
      // ))

      setMeetingList((prev) => [response.data, ...prev]);
    }

    meetingDialog.handleClose();
  };

  const deleteMeeting = async () => {
    // if (!DeleteWorkSpaceDialog.data?._id) return null;
    // await handleDeleteWorkSpace(DeleteWorkSpaceDialog.data._id);
    // DeleteWorkSpaceDialog.handleClose();
  };

  const handleStatusChange = (event: SyntheticEvent, newValue: string) => {
    setMeetingStatus(newValue);
  };

  useEffect(() => {
    getMeetins();
  }, [getMeetins]);

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
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            alignItems={"center"}
          >
            <Typography variant={isSmallScreen ? "h5" : "h4"}>
              Schedule Meetings
            </Typography>

            {user?.role !== ROLES.Employee && (
              <Button
                variant="contained"
                size={isSmallScreen ? "small" : "medium"}
                onClick={() => {
                  meetingDialog.handleOpen({
                    type: "Create",
                    values: meetingInitialValues,
                  });
                }}
              >
                Create Meeting
              </Button>
            )}
          </Stack>

          <Tabs
            indicatorColor="primary"
            onChange={handleStatusChange}
            value={meetingStatus}
            sx={{
              borderBottom: 1,
              borderColor: "#ddd",
            }}
          >
            {MeetingStatus.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disabled={isLoading}
              />
            ))}
          </Tabs>

          <Scrollbar sx={{ maxHeight: 580, overflowY: "auto", py: 2, px: 2 }}>
            <Grid container spacing={2}>
              {isLoading ? (
                [...Array(4)].map((_, index) => (
                  <Grid item xs={12} xl={3} lg={4} md={6} key={index}>
                    <MeetingCard isLoading={isLoading} />
                  </Grid>
                ))
              ) : !meetingList.length ? (
                <Grid item xs={12}>
                  <NoRecordFound />
                </Grid>
              ) : (
                meetingList.map((meeting: Meeting) => (
                  <Grid item xs={12} xl={3} lg={4} md={6} key={meeting._id}>
                    <MeetingCard
                      meeting={meeting}
                      isLoading={isLoading}
                      handleUpdateMeeting={() => {
                        meetingDialog.handleOpen({
                          type: "Update",
                        });
                      }}
                      handleDeleteMeeting={() =>
                        DeleteMeetingDialog.handleOpen({
                          _id: meeting._id,
                          title: meeting.title,
                        })
                      }
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Scrollbar>
        </Stack>
      </Container>

      {meetingDialog.open && (
        <MeetingModal
          modalType={meetingDialog.data?.type}
          modal={meetingDialog.open}
          meetingValues={meetingDialog.data?.values || meetingInitialValues}
          onCancel={meetingDialog.handleClose}
          onSubmit={createAndUpdateMeeting}
        />
      )}

      {DeleteMeetingDialog.open && (
        <ConfirmationModal
          modal={DeleteMeetingDialog.open}
          onConfirm={deleteMeeting}
          onCancel={DeleteMeetingDialog.handleClose}
          content={{
            type: "Delete Meeting",
            text: `Are you sure you want to delete that meeting? `,
          }}
        />
      )}
    </Box>
  );
};

const MeetingList: NextPage = () => {
  return <MeetingListComponent />;
};

MeetingList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { MeetingList };
