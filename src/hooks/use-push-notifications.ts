import { useEffect } from "react";
import { notificationsApi } from "src/api";

export const usePushNotifications = () => {
  const subscribeUser = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await notificationsApi.subscribeUser(subscription);
    } else {
      await notificationsApi.removeSubscribedUser();
    }
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        await navigator.serviceWorker.register("/service_worker.js");

        await subscribeUser();
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  };

  useEffect(() => {
    registerServiceWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
