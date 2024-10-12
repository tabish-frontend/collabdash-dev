import { DashboardLayout } from "src/layouts";
import type { NextPage } from "next";
import { useAuth } from "src/hooks";
import { useEffect, useState } from "react";
import { AuthContextType } from "src/contexts/auth";
import { useRouter } from "next/router";
import { meetingApi } from "src/api";
import { Meeting } from "src/types";
import { WaitingScreen } from "./waiting-screen";
import { ConferenceRoom } from "src/components/shared";
import dayjs from "dayjs";
import { paths } from "src/constants/paths";
import { ThankYouScreen } from "./thankyou-screen";

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

const validateRecurringMeeting = (
  meetingStartTime: dayjs.Dayjs,
  meetingDays: string[],
  setErrorMessage: any
): boolean => {
  const now = dayjs();

  const todayDay = now.format("dddd"); // Get the full name of the day (e.g., "Monday")

  // Validate if today is a scheduled meeting day
  if (!meetingDays.includes(todayDay)) {
    setErrorMessage("Meeting has not been scheduled for today.");
    return false;
  }

  // Extract hour and minute for both current time and meeting start time
  const currentHour = now.hour();
  const currentMinute = now.minute();
  const meetingHour = meetingStartTime.hour();
  const meetingMinute = meetingStartTime.minute();

  // Validate if current time is within the allowed joining period (15 minutes before)
  const fifteenMinutesBeforeMeeting = meetingStartTime.subtract(15, "minute");
  const joinableHour = fifteenMinutesBeforeMeeting.hour();
  const joinableMinute = fifteenMinutesBeforeMeeting.minute();

  // Check if now is before the joinable time
  if (
    currentHour < joinableHour ||
    (currentHour === joinableHour && currentMinute < joinableMinute)
  ) {
    setErrorMessage(
      "You can only join the meeting up to 15 minutes before it starts"
    );
    return false;
  }

  // Calculate the latest joinable time (2 hours after the meeting starts)
  const twoHoursAfterMeetingHour = meetingHour + 2;

  // Check if the meeting time has already passed or if it's too late to join
  if (
    currentHour > twoHoursAfterMeetingHour ||
    (currentHour === twoHoursAfterMeetingHour && currentMinute > meetingMinute)
  ) {
    setErrorMessage("Meeting time has already passed");
    return false;
  }

  return true; // All validations passed for recurring meetings
};

const validateMeetingTiming = (
  meetingData: Meeting,
  setErrorMessage: any
): boolean => {
  if (!meetingData.time) return false;
  const now = dayjs();
  const meetingStartTime = dayjs(meetingData.time);

  // Check if the meeting is recurring
  if (meetingData.recurring) {
    return validateRecurringMeeting(
      meetingStartTime,
      meetingData.meeting_days,
      setErrorMessage
    );
  }

  const fifteenMinutesBeforeMeeting = meetingStartTime.subtract(15, "minute");

  if (now < fifteenMinutesBeforeMeeting) {
    setErrorMessage(
      "You can only join the meeting up to 15 minutes before it starts"
    );
    return false;
  }

  const twoHoursAfterMeeting = meetingStartTime.add(2, "hour");

  if (now > twoHoursAfterMeeting) {
    setErrorMessage("Meeting has been ended");
    return false;
  }

  return true;
};

// Main function to handle validation of room and session
const validateRoomAndMeeting = (
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

  const [meetingExist, setMeetingExist] = useState<boolean>(false);
  const [thankYouPage, setThankYouPage] = useState<boolean>(false);
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

      setDisplayRoomName(data.title);
      validateRoomAndMeeting(data, setMeetingExist, setErrorMessage);
    };

    checkRoomExists();
  }, [meeting_url]);

  console.log("user 111", user);

  const handleLeaveMeeting = async () => {
    console.log("Trigger Video Conference Leave");

    setMeetingExist(false);

    console.log("user 011", user);

    if (user) {
      router.push(paths.index);
    } else {
      setThankYouPage(true);
    }
  };

  // If there's an error, render the error message screen
  if (errorMessage) {
    return <WaitingScreen message={errorMessage} />;
  }

  if (thankYouPage) {
    return <ThankYouScreen />;
  }

  return (
    <div>
      {meetingExist && (
        <ConferenceRoom
          readOnlyName={user ? true : false}
          RoomName={displayRoomName}
          onConferenceLeft={handleLeaveMeeting}
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
