import type { Message, Participant, Thread } from "src/types/chat";

import Axios from "src/config/axios";
import { Employee } from "src/types";

type GetContactsRequest = {
  query?: string;
};

type GetContactsResponse = Promise<Employee[]>;

type GetThreadsRequest = object;

type GetThreadsResponse = Promise<Thread[]>;

type GetThreadRequest = {
  threadKey: string;
};

type GetThreadResponse = Promise<Thread | null>;

type MarkThreadAsSeenRequest = {
  threadId: string;
};

type MarkThreadAsSeenResponse = Promise<true>;

type GetParticipantsRequest = {
  threadKey: string;
};

type GetParticipantsResponse = Promise<Participant[]>;

type AddMessageRequest = {
  threadId?: string;
  recipientIds?: string[];
  body: string;
};

type AddMessageResponse = Promise<{
  message: Message;
  threadId: string;
}>;

class ChatApi {
  async getContacts(request: GetContactsRequest = {}): GetContactsResponse {
    const { query } = request;

    const response = await Axios.get(`/messages/contacts?search=${query}`);

    return response.data;
  }

  async getThreads(request: GetThreadsRequest = {}): GetThreadsResponse {
    const response = await Axios.get(`/messages`);

    return response.data;
  }

  async getThread(request: GetThreadRequest): GetThreadResponse {
    const { threadKey } = request;

    const response = await Axios.get(`/messages/thread/${threadKey}`);

    return response.data;
  }

  async getParticipants(
    request: GetParticipantsRequest
  ): GetParticipantsResponse {
    const { threadKey } = request;

    const response = await Axios.get(`/messages/${threadKey}`);

    return response.data;
  }

  async addMessage(request: AddMessageRequest): AddMessageResponse {
    const response = await Axios.post(`/messages/send`, request);

    return response.data;
  }

  markThreadAsSeen(request: MarkThreadAsSeenRequest): MarkThreadAsSeenResponse {
    const { threadId } = request;

    return new Promise((resolve, reject) => {
      // try {
      //   const thread = threads.find((thread) => thread.id === threadId);
      //   if (thread) {
      //     thread.unreadCount = 0;
      //   }
      //   resolve(true);
      // } catch (err) {
      //   reject(new Error("Internal server error"));
      // }
    });
  }
}

export const chatApi = new ChatApi();
