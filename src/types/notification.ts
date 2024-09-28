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
  time: Date;
  read: boolean;
  createdAt: Date;
}
