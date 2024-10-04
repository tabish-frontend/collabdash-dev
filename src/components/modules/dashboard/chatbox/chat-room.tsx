import { DashboardLayout } from "src/layouts";
import type { NextPage } from "next";
import { useAuth, useSearchParams } from "src/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContextType } from "src/contexts/auth";
import { useRouter } from "next/router";
import { Thread } from "src/types";
import { paths } from "src/constants/paths";
import { chatApi } from "src/api/chat";
import { ConferenceRoom } from "src/components/shared";
import { wait } from "src/utils";

// Function to fetch session data from API
const fetchThreadData = async (threadKey: string): Promise<Thread | null> => {
  const populateFields: string[] = [];

  try {
    const response = await chatApi.getThread({ threadKey, populateFields });
    return response;
  } catch (e) {
    return null;
  }
};

// Function to validate enrollment based on user role
const validateEnrollment = (chatData: any, userId: string | undefined) => {
  if (!userId) {
    toast.error("You are not logged in please login to get access");
    return false;
  }

  const userExist = chatData.participants.includes(userId);

  if (!userExist) {
    toast.error("You not enrolled in this chat");
    return false;
  }

  return true;
};

const ChatRoomComponent = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const threadKey = searchParams.get("threadKey") || undefined;

  const [chatRoomExist, setChatRoomExist] = useState<boolean>(false);
  const [displayRoomName, setDisplayRoomName] = useState("");

  const { user } = useAuth<AuthContextType>();

  const userId = user?._id;

  // useEffect to check room existence on component mount or roomName change
  useEffect(() => {
    const checkRoomExists = async () => {
      if (!threadKey) {
        setChatRoomExist(false);
        return;
      }

      const data = await fetchThreadData(threadKey as string);

      if (!data) {
        setChatRoomExist(false); // No data, room doesn't exist
        router.push(paths.chat);
        toast.error("Invalid Thread Key");
        return;
      }

      if (!validateEnrollment(data, userId)) {
        setChatRoomExist(false);
        await wait(2000);
        router.push(paths.chat);
        return;
      }

      setChatRoomExist(true);
      setDisplayRoomName(data._id);
    };

    checkRoomExists();
  }, [router, threadKey, userId]);

  // Define the handler for when the user leaves the video conference
  const handleCallLeft = () => {
    // toast.info("You have left the video conference.");
    router.push(paths.chat + `?threadKey=${threadKey}`);
  };

  return (
    <div>
      {chatRoomExist && (
        <ConferenceRoom
          Allowed={true}
          RoomName={displayRoomName}
          onConferenceLeft={handleCallLeft} // Pass the event listener for ChatRoom only
        />
      )}
    </div>
  );
};

const ChatRoom: NextPage = () => {
  return <ChatRoomComponent />;
};

ChatRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { ChatRoom };
