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
import {
  ConfirmationModal,
  NoRecordFound,
  SkeletonMeetingCard,
} from "src/components/shared";
import { Meeting } from "src/types";
import { meetingInitialValues } from "src/formik";
import { meetingApi } from "src/api";
import { MeetingCard } from "./meetingCard";
import { MeetingModal } from "./meeting-modal";

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

    if (meetingDialog.data?.type === "Update") {
      const response = await meetingApi.updateMeeting(
        _id as string,
        meetingValues
      );

      // Update the meeting in the state
      setMeetingList((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === _id ? response.data : meeting
        )
      );
    } else {
      const response = await meetingApi.createMeeting(meetingValues);
      setMeetingList((prev) => [response.data, ...prev]);
    }

    meetingDialog.handleClose();
  };

  const deleteMeeting = async () => {
    if (!DeleteMeetingDialog.data?._id) return null;
    await meetingApi.deleteMeeting(DeleteMeetingDialog.data._id);

    // Update the meetingListState by removing the deleted meeting
    setMeetingList((prevMeetings) =>
      prevMeetings.filter(
        (meeting) => meeting._id !== DeleteMeetingDialog.data?._id
      )
    );

    DeleteMeetingDialog.handleClose();
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
                  <Grid item xs={12} xl={4} lg={4} md={6} key={index}>
                    <SkeletonMeetingCard />
                  </Grid>
                ))
              ) : !meetingList.length ? (
                <Grid item xs={12}>
                  <NoRecordFound />
                </Grid>
              ) : (
                meetingList.map((meeting: Meeting) => (
                  <Grid item xs={12} xl={4} lg={4} md={6} key={meeting._id}>
                    <MeetingCard
                      meeting={meeting}
                      isUpcomingMeetings={meetingStatus === "upcoming"}
                      handleUpdateMeeting={() => {
                        meetingDialog.handleOpen({
                          type: "Update",
                          values: meeting,
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
