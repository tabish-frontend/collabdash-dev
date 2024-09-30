import { useCallback, useEffect, useState } from "react";
import { Notification } from "src/types";
import { useSocketContext } from "./use-socket";
import { notificationsApi } from "src/api";

// Custom hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocketContext();

  const fetchInitialNotifications = useCallback(async () => {
    const response = await notificationsApi.getNotifications();

    setNotifications(response); // Set initial notifications from the API
  }, []);

  // Fetch initial notifications on component mount
  useEffect(() => {
    fetchInitialNotifications();
  }, [fetchInitialNotifications]);

  // Listen for new notifications from the socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    };

    // Listen to the "new-notification" event
    socket.on("receiveNotification", handleNewNotification);

    return () => {
      // Cleanup the event listener when component unmounts
      socket.off("receiveNotification", handleNewNotification);
    };
  }, [socket]);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }, []);

  // Function to remove a specific notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification._id !== notificationId
      )
    );
  }, []);

  // Calculate the number of unread notifications
  const unreadCount = notifications.reduce(
    (acc, notification) => acc + (notification.read ? 0 : 1),
    0
  );

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    removeNotification,
  };
};
