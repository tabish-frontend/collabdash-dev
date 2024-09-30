interface Attachment {
  _id: string;
  url: string;
}

export interface Message {
  _id: string;
  attachments: Attachment[];
  body: string;
  contentType: string;
  createdAt: string;
  author: string;
}

export interface Participant {
  _id?: string;
  full_name?: string;
  avatar: string | null;
}

export interface Thread {
  _id: string;
  messages: Message[];
  participants: Participant[];
  type: "ONE_TO_ONE" | "GROUP";
  unreadCount?: number;
}
