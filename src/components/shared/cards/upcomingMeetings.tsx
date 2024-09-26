import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  AvatarGroup,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import { Meeting } from "src/types";
import { meetingApi } from "src/api";
import { styled } from "@mui/material";
import { getDay_Time } from "src/utils";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useRouter } from "next/router";
import { Scrollbar } from "src/utils/scrollbar";
import { paths } from "src/constants/paths";
import dayjs from "dayjs";

const MeetingItem = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const UpcomingMeetingsCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [meetingStatus, setMeetingStatus] = useState<string>("upcoming");

  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getMeetins = useCallback(async () => {
    setIsLoading(true);
    const response = await meetingApi.getAllMeetings(meetingStatus);
    setMeetingList(response.data);
    setIsLoading(false);
  }, [meetingStatus]);

  useEffect(() => {
    getMeetins();
    console.log("Upcoming Meetings: ", meetingList);
  }, [getMeetins]);

  return (
    <>
      <Card sx={{ minHeight: 490 }}>
        <CardHeader
          sx={{ padding: isSmallScreen ? "28px 20px" : "28px 24px" }}
          title="Upcoming Meetings"
        />

        <Scrollbar sx={{ maxHeight: 360, overflowY: "auto" }}>
          <CardContent
            sx={{ padding: isSmallScreen ? "28px 20px" : "28px 24px" }}
          >
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <CircularProgress />
              </Box>
            ) : meetingList.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <Typography variant="h6" textAlign="center">
                  No Upcoming Meetings
                </Typography>
              </Box>
            ) : (
              meetingList.map((meeting) => {
                const meetingMonth = dayjs(meeting.time).format("MMM");
                const meetingDate = dayjs(meeting.time).format("D");
                const meetingTime = dayjs(meeting.time).format("h:mm A");

                return (
                  <MeetingItem key={meeting._id}>
                    <Stack direction={"row"} spacing={2} width={"100%"}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Stack
                          direction={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {meetingMonth}
                          </Typography>
                          <Typography
                            variant="h5"
                            component="span"
                            sx={{ fontWeight: "bold" }}
                          >
                            {meetingDate}
                          </Typography>
                        </Stack>
                      </Box>
                      {/* <ColorBar barcolor={getRandomColor()} /> */}
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ width: 4, backgroundColor: "#3B8299" }}
                      />
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"flex-start"}
                        width={"100%"}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant={isSmallScreen ? "subtitle2" : "h6"}
                            sx={{ mb: 0.5, fontWeight: "bold" }}
                          >
                            {meeting.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {meetingTime}
                          </Typography>
                        </Box>
                        <Button
                          variant="text"
                          sx={{ padding: "6px 8px" }}
                          color={
                            theme.palette.mode === "dark" ? "info" : "primary"
                          }
                          endIcon={
                            isSmallScreen ? "" : <ChevronRightOutlinedIcon />
                          }
                          onClick={() =>
                            router.push(`${paths.meetings}/${meeting?._id}`)
                          }
                          size={isSmallScreen ? "small" : "medium"}
                        >
                          Join Meeting
                        </Button>
                      </Stack>
                    </Stack>
                  </MeetingItem>
                );
              })
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </>
  );
};
