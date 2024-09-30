import { useEffect } from "react";
import { useSocketContext } from "./use-socket";
import { slice } from "src/store/slices/chat";
import { thunks } from "src/thunks/chat";
import { useDispatch } from "src/store";
// import notificationSound from "../assets/sounds/notification.mp3";

export const useListenMessages = () => {
  const { socket } = useSocketContext();

  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      // newMessage.shouldShake = true;
      // 	const sound = new Audio(notificationSound);
      // 	sound.play();

      // Optionally, you can also dispatch this to Redux to keep the state updated
      dispatch(slice.actions.addMessage(message));

      dispatch(
        thunks.getThread({
          threadKey: message.threadId,
        })
      );
    });

    // Cleanup the event listener on component unmount
    return () => {
      socket?.off("receiveMessage");
    };
  }, [dispatch, socket]);
};
