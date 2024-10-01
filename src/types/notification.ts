export interface Notification {
  _id: string;
  sender: {
    _id: string;
    full_name: string;
    avatar: string;
  };
  receiver: string[];
  message: string;
  link: string;
  target_link: string;
  time: Date;
  read: boolean;
  hide_sender_name: boolean;
  createdAt: Date;
}
