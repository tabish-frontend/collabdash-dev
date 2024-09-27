// src/hooks/usePushNotifications.ts
import { useEffect } from "react";
import { notificationsApi } from "src/api";

export const usePushNotifications = () => {
  const subscribeUser = async () => {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("permission", permission);

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      console.log("Subscription:", subscription); // Log the subscription
      await notificationsApi.subscribeUser(subscription);
    } else {
      console.warn("Notifications permission denied:", permission);
      await notificationsApi.removeSubscribedUser();
    }
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/service_worker.js"
        );
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        // Call subscribeUser after successful registration
        await subscribeUser();
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);
};
