import { subDays, subHours } from "date-fns";

export interface Notification {
  id: string; // Equivalent to "_id" in your data
  sender: {
    id: string; // Equivalent to "_id" inside the sender object
    fullName: string; // Equivalent to "full_name" inside the sender object
    avatar: string; // Equivalent to "avatar" inside the sender object
  };
  receiver: string[]; // Array of user IDs who are receiving the notification
  message: string; // The notification message
  link: string; // Equivalent to "message_type", e.g., "add_job", etc.
  time: Date; // Equivalent to "message_type", e.g., "add_job", etc.
  read: boolean; // Whether the notification has been read or not
  createdAt: Date; // Timestamp for when the notification was created
  updatedAt: Date; // Timestamp for when the notification was last updated
}

const now = new Date();

// export const notifications: Notification[] = [
//   {
//     id: "5e8883f1b51cc1956a5a1ec0",
//     author: "Jie Yang Song",
//     avatar: "/assets/avatars/avatar-jie-yan-song.png",
//     createdAt: subHours(now, 2).getTime(),
//     task: "Remote React / React Native Developer",
//     read: true,
//     type: "task_add",
//   },
//   {
//     id: "bfb21a370c017acc416757c7",
//     author: "Jie Yang Song",
//     avatar: "/assets/avatars/avatar-jie-yan-song.png",
//     createdAt: subHours(now, 2).getTime(),
//     task: "Senior Golang Backend Engineer",
//     read: false,
//     type: "task_add",
//   },
//   {
//     id: "20d9df4f23fff19668d7031c",
//     createdAt: subDays(now, 1).getTime(),
//     description: "Logistics management is now available",
//     read: true,
//     type: "new_feature",
//   },
//   {
//     id: "5e8883fca0e8612044248ecf",
//     author: "Jie Yang Song",
//     avatar: "/assets/avatars/avatar-jie-yan-song.png",
//     company: "Augmastic Inc",
//     createdAt: subHours(now, 2).getTime(),
//     read: false,
//     type: "company_created",
//   },
// ];
