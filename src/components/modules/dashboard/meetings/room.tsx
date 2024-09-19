import { DashboardLayout } from "src/layouts";
import type { NextPage } from "next";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAuth } from "src/hooks";
// import { paths, roles } from "src/constants";
import { useEffect, useState } from "react";
// import { classesApi } from "src/api/class-api";
import { toast } from "react-toastify";
import { AuthContextType } from "src/contexts/auth";
import { JitsiConfigOverwrite } from "src/constants/jitsi-config";
import { useRouter } from "next/router";

// Function to fetch session data from API
// const fetchSessionData = async (roomName: string, router: any) => {
//   try {
//     const response = await classesApi.getClassSession(roomName);
//     return response.data;
//   } catch (e) {
//     router.back();
//     toast.error("Room not found or session doesn't exist.");
//   }
// };

// // Function to validate session timing
// const validateSessionTiming = (
//   sessionData: any,
//   currentTime: number,
//   router: any
// ) => {
//   const sessionStartTime = new Date(sessionData.start).getTime();
//   const sessionEndTime = new Date(sessionData.end).getTime();
//   const fifteenMinutesBeforeStart = sessionStartTime - 15 * 60 * 1000; // 15 minutes before start time

//   if (currentTime < fifteenMinutesBeforeStart) {
//     toast.error(
//       "You can only join the session up to 15 minutes before it starts."
//     );
//     router.back();
//     return false;
//   }

//   if (currentTime > sessionEndTime) {
//     toast.error("Meeting has ended");
//     router.back();
//     return false;
//   }

//   return true;
// };

// // Function to validate if the child is enrolled in the session
// const validateChildEnrollment = (
//   sessionData: any,
//   childId: string | null,
//   router: any
// ) => {
//   if (!childId) {
//     router.back();
//     toast.error("Please Join with child ID");
//     return false;
//   }

//   const childExists = sessionData.students.some(
//     (student: any) => student.student._id === childId
//   );

//   if (!childExists) {
//     router.back();
//     toast.error("Child not enrolled in this session");
//     return false;
//   }

//   return true;
// };

// // Main function to handle validation of room and session
// const validateRoomAndSession = (
//   sessionData: any,
//   userRole: string,
//   childId: string | null,
//   setRoomExists: (exists: boolean) => void,
//   router: any
// ) => {
//   const currentTime = new Date().getTime();

//   // Parent role validation
//   if (userRole === roles.PARENT) {
//     if (!validateChildEnrollment(sessionData, childId, router)) {
//       setRoomExists(false);
//       return;
//     }
//   }

//   // Session timing validation
//   if (!validateSessionTiming(sessionData, currentTime, router)) {
//     setRoomExists(false);
//     return;
//   }

//   // If all checks pass, set roomExists to true
//   setRoomExists(true);
// };

const MeetingRoomComponent = () => {
  console.log("hitting Room");
  const router = useRouter();
  const { user } = useAuth<AuthContextType>();
  const { meeting_url } = router.query;

  console.log("Router", router.query.meeting_url);
  const [displayRoomName, setDisplayRoomName] = useState("");

  useEffect(() => {
    setDisplayRoomName(meeting_url as string);
  }, [meeting_url]);

  // const childId = router.query.childId;
  // const childName = router.query.childName;

  // const userRole = user.role;
  // const userId = user._id;

  // const displayUsername =
  //   userRole === roles.ADMIN ? "Admin" : childName || user.full_name || "User";

  // const [sessionData, setSessionData] = useState<any>();
  // const [roomExists, setRoomExists] = useState<boolean | null>(false);
  // const [showFeedback, setShowFeedback] = useState<boolean>(false);
  // const [isMeetingEnded, setIsMeetingEnded] = useState<boolean>(false);
  // let isJoined = false;

  // useEffect to check room existence on component mount or roomName change
  // useEffect(() => {
  //   const checkRoomExists = async () => {
  //     try {
  //       const data = await fetchSessionData(meeting_url as string, router);

  //       setSessionData(data);
  //       setDisplayRoomName(
  //         `${data.subject} class ongoing with ${
  //           data.teacher.teacher.first_name
  //         } and ${data.students.map((student: any) =>
  //           student.student.full_name.trim(" ")
  //         )}`
  //       );

  //       validateRoomAndSession(
  //         data,
  //         userRole,
  //         childId as string,
  //         setRoomExists,
  //         router
  //       );
  //     } catch (error) {
  //       router.back();
  //       toast.error(error.message);
  //       setRoomExists(false);
  //     }
  //   };

  //   if (meeting_url) {
  //     checkRoomExists();
  //   } else {
  //     router.back();
  //     toast.error("Meeting Link is Required");
  //     setRoomExists(false);
  //   }
  // }, [meeting_url, userRole, childId, router]);

  // // Capture start time when user joins the meeting
  // const handleJoinMeeting = async () => {
  //   isJoined = true;

  //   console.log("Trigger Video Conference Joined");

  //   if (userRole === roles.TEACHER) {
  //     if (sessionData.teacher.session_time_logs.total.start === null) {
  //       await teacher_classesTimeAPI.updateClassTime(meeting_url, "start");
  //     }
  //   }

  //   if (userRole === roles.STUDENT) {
  //     const currentStudent = sessionData.students.find(
  //       (student: any) => student.student._id === userId
  //     );

  //     if (!currentStudent.session_time_logs.total.start) {
  //       await student_classesTimeAPI.updateClassTime(meeting_url, "start");
  //     }
  //   }

  //   if (user.role === roles.PARENT) {
  //     const currentStudent = sessionData.students.find(
  //       (student: any) => student.student._id === childId
  //     );

  //     if (!currentStudent.session_time_logs.total.start) {
  //       await children_classesTimeAPI.updateClassTime(
  //         meeting_url,
  //         childId,
  //         "start"
  //       );
  //     }
  //   }
  // };

  // const handleLeaveMeeting = async () => {
  //   if (!isJoined || isMeetingEnded) {
  //     return;
  //   }
  //   setIsMeetingEnded(true);

  //   console.log("Trigger Video Conference Joined");

  //   if (userRole === roles.TEACHER) {
  //     await teacher_classesTimeAPI.updateClassTime(meeting_url, "end");
  //     setShowFeedback(true);
  //   }

  //   if (userRole === roles.STUDENT) {
  //     await student_classesTimeAPI.updateClassTime(meeting_url, "end");
  //     setShowFeedback(true);
  //   }

  //   if (userRole === roles.PARENT) {
  //     await children_classesTimeAPI.updateClassTime(
  //       meeting_url,
  //       childId,
  //       "end"
  //     );
  //     setShowFeedback(true);
  //   }

  //   isJoined = false;
  // };

  // const handleFeedbackSubmit = async (feedback: any) => {
  //   if (userRole === roles.PARENT) {
  //     await feedbackApi.submitFeedback(roles.STUDENT, {
  //       sessionId: meeting_url,
  //       user: childId,
  //       user_feedback: feedback,
  //     });
  //     setShowFeedback(false);
  //     router.back();
  //   } else {
  //     await feedbackApi.submitFeedback(userRole, {
  //       sessionId: meeting_url,
  //       user_feedback: feedback,
  //     });
  //   }
  //   setShowFeedback(false);
  //   router.back();
  // };

  // const handleUnload = (event: BeforeUnloadEvent) => {
  //   if (isJoined) {
  //     handleLeaveMeeting();
  //   }
  // };

  // useEffect(() => {
  //   if (isJoined) {
  //     window.addEventListener("beforeunload", handleUnload);
  //     return () => {
  //       window.removeEventListener("beforeunload", handleUnload);
  //     };
  //   }
  // }, [isJoined]);

  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      <JitsiMeeting
        domain="ss.tuitionhighway.com" // You can use your own Jitsi server domain if you have one
        roomName={displayRoomName} // Room name, can be dynamic
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
          // Jitsi Meeting API is ready
          console.log("Jitsi Meeting API is ready!", externalApi);
          // externalApi.addListener("videoConferenceJoined", handleJoinMeeting); // Event listener for when user join the meeting
          // externalApi.addListener("videoConferenceLeft", handleLeaveMeeting);
        }}
      />
    </div>
  );
};

const MeetingRoom: NextPage = () => {
  return <MeetingRoomComponent />;
};

MeetingRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { MeetingRoom };
