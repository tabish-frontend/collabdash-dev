import { DashboardLayout } from "src/layouts";
import type { NextPage } from "next";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAuth } from "src/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContextType } from "src/contexts/auth";
import { JitsiConfigOverwrite } from "src/constants/jitsi-config";
import { useRouter } from "next/router";
import { meetingApi } from "src/api";
import { Meeting } from "src/types";

// Function to fetch session data from API
const fetchMeetingData = async (
  meetingId: string,
  setErrorMessage: any
): Promise<Meeting | null> => {
  try {
    const response = await meetingApi.getMeeting(meetingId);
    return response.data;
  } catch (e) {
    setErrorMessage("Meeting not found.");
    return null;
  }
};

// Function to validate session timing
const validateMeetingTiming = (
  meetingData: Meeting,
  setErrorMessage: any
): boolean => {
  const currentTime = new Date().getTime();
  const meetingStartTime = meetingData.time
    ? new Date(meetingData.time).getTime()
    : new Date().getTime();
  const fifteenMinutesBeforeStart = meetingStartTime - 15 * 60 * 1000; // 15 minutes before start time

  if (currentTime < fifteenMinutesBeforeStart) {
    setErrorMessage(
      "You can only join the meeting up to 15 minutes before it starts."
    );
    return false;
  }
  return true;
};

// Main function to handle validation of room and session
const validateRoomAndSession = (
  meetingData: Meeting,
  setRoomExists: (exists: boolean) => void,
  setErrorMessage: any
) => {
  // Session timing validation
  if (!validateMeetingTiming(meetingData, setErrorMessage)) {
    setRoomExists(false);
    return;
  }
  // If all checks pass, set roomExists to true
  setRoomExists(true);
};

const MeetingRoomComponent = () => {
  const router = useRouter();
  const { user } = useAuth<AuthContextType>();
  const { meeting_url } = router.query;

  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const [meetingExist, setMeetingExist] = useState<boolean>(false);
  const [displayRoomName, setDisplayRoomName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

  // useEffect to check room existence on component mount or roomName change
  useEffect(() => {
    const checkRoomExists = async () => {
      if (!meeting_url) {
        setMeetingExist(false);
        return;
      }

      const data = await fetchMeetingData(
        meeting_url as string,
        setErrorMessage
      );

      if (!data) {
        setMeetingExist(false); // No data, room doesn't exist
        return;
      }

      setMeetingData(data);
      setDisplayRoomName(data.title);
      validateRoomAndSession(data, setMeetingExist, setErrorMessage);
    };

    checkRoomExists();
  }, [meeting_url]);

  // If there's an error, render the error message screen
  if (errorMessage) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      {meetingExist && (
        <JitsiMeeting
          domain="ss.tuitionhighway.com"
          roomName={displayRoomName}
          configOverwrite={JitsiConfigOverwrite}
          interfaceConfigOverwrite={{}}
          userInfo={{
            displayName: user?.full_name || "Guest User",
            email: user?.email || "user@gmail.com",
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
          onApiReady={(externalApi) => {
            console.log("Jitsi Meeting API is ready!", externalApi);
          }}
        />
      )}
    </div>
  );
};

const MeetingRoom: NextPage = () => {
  return <MeetingRoomComponent />;
};

MeetingRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { MeetingRoom };
