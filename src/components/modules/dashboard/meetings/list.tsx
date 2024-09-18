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
import { SyntheticEvent, useState } from "react";
import { MeetingStatus } from "src/constants/status";
import { Scrollbar } from "src/utils/scrollbar";
import { MeetingCard } from "src/components/shared/cards/meetingCard";
import { ConfirmationModal, NoRecordFound } from "src/components/shared";
import {
  Meeting,
  meetingInitialValues,
  MeetingModal,
} from "src/components/shared/modals/meeting-modal";

interface FiltersType {
  meeting_status: string;
}

interface MeetingDialogData {
  type: string;
  values?: Meeting;
}

interface DeleteMeetingDialogData {
  _id?: string;
  title: string;
}
// Dummy data for meetingList
const meetingList = [
  {
    _id: "1",
    title: "Project Kickoff Meeting With Agile Methodology",
    organiser: {
      name: "John Doe",
      avatar: "/assets/avatars/avatar-alcides-antonio.png",
    },
    date: "2024-09-16",
    participants: [
      { full_name: "Alice", avatar: "/assets/avatars/avatar-anika-visser.png" },
      { full_name: "Bob", avatar: "/assets/avatars/avatar-carson-darrin.png" },
    ],
  },
  {
    _id: "2",
    title: "Design Review",
    organiser: {
      name: "Jane Smith",
      avatar: "/assets/avatars/avatar-chinasa-neo.png",
    },
    date: "2024-09-17",
    participants: [
      {
        full_name: "Charlie",
        avatar: "/assets/avatars/avatar-anika-visser.png",
      },
      { full_name: "Dave", avatar: "/assets/avatars/avatar-iulia-albu.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-miron-vitold.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-miron-vitold.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-miron-vitold.png" },
    ],
  },
  {
    _id: "3",
    title: "Sprint Planning",
    organiser: {
      name: "Mark Taylor",
      avatar: "/assets/avatars/avatar-marcus-finn.png",
    },
    date: "2024-09-18",
    participants: [
      {
        full_name: "Alice",
        avatar: "/assets/avatars/avatar-nasimiyu-danai.png",
      },
      { full_name: "Bob", avatar: "/assets/avatars/avatar-neha-punita.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-seo-hyeon-ji.png" },
    ],
  },
  {
    _id: "4",
    title: "Sprint Planning",
    organiser: {
      name: "Mark Taylor",
      avatar: "/assets/avatars/avatar-marcus-finn.png",
    },
    date: "2024-09-18",
    participants: [
      {
        full_name: "Alice",
        avatar: "/assets/avatars/avatar-nasimiyu-danai.png",
      },
      { full_name: "Bob", avatar: "/assets/avatars/avatar-neha-punita.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-seo-hyeon-ji.png" },
    ],
  },
  {
    _id: "5",
    title: "Sprint Planning",
    organiser: {
      name: "Mark Taylor",
      avatar: "/assets/avatars/avatar-marcus-finn.png",
    },
    date: "2024-09-18",
    participants: [
      {
        full_name: "Alice",
        avatar: "/assets/avatars/avatar-nasimiyu-danai.png",
      },
      { full_name: "Bob", avatar: "/assets/avatars/avatar-neha-punita.png" },
      { full_name: "Eve", avatar: "/assets/avatars/avatar-seo-hyeon-ji.png" },
    ],
  },
];

const MeetingListComponent = () => {
  const settings = useSettings();
  const { user } = useAuth<AuthContextType>();
  const theme = useTheme();

  const meetingDialog = useDialog<MeetingDialogData>();
  const DeleteMeetingDialog = useDialog<DeleteMeetingDialogData>();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersType>({
    meeting_status: "upcoming",
  });

  const handleStatusChange = (event: SyntheticEvent, newValue: string) => {
    setFilters((prev) => ({ ...prev, meeting_status: newValue }));
  };

  const deleteMeeting = async () => {
    // if (!DeleteWorkSpaceDialog.data?._id) return null;
    // await handleDeleteWorkSpace(DeleteWorkSpaceDialog.data._id);
    // DeleteWorkSpaceDialog.handleClose();
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
                // startIcon={
                //   <SvgIcon>
                //     <Plus />
                //   </SvgIcon>
                // }
                onClick={() => {
                  meetingDialog.handleOpen({
                    type: "create",
                    values: meetingInitialValues, // This ensures default initial values are passed
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
            value={filters.meeting_status}
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
                [...Array(9)].map((_, index) => (
                  <Grid item xs={12} sm={6} xl={4} key={index}>
                    <MeetingCard isLoading={isLoading} />
                  </Grid>
                ))
              ) : meetingList.length === 0 ? (
                <Grid item xs={12}>
                  <NoRecordFound />
                </Grid>
              ) : (
                meetingList.map((meeting: any) => (
                  <Grid item xs={12} xl={3} lg={4} md={6} key={meeting._id}>
                    <MeetingCard
                      meeting={meeting}
                      isLoading={isLoading}
                      handleUpdateMeeting={() => {
                        meetingDialog.handleOpen({
                          type: "Update",
                          // values: meeting,
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
          meetingValues={meetingDialog.data?.values || meetingInitialValues} // If no data, pass meetingInitialValues
          onCancel={meetingDialog.handleClose}
        />
      )}

      {DeleteMeetingDialog.open && (
        <ConfirmationModal
          modal={DeleteMeetingDialog.open}
          onConfirm={deleteMeeting}
          onCancel={DeleteMeetingDialog.handleClose}
          content={{
            type: "Delete Meeting",
            // text: `Are you sure you want to delete ${selectedWorkspace?.title} workspace? `,
            text: `Are you sure you want to delete ${DeleteMeetingDialog.data?.title} meeting? `,
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
