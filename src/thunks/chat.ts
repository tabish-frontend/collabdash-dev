// import { chatApi } from "src/api/chat";
// import { slice } from "src/store/slices/chat";
// import type { AppThunk } from "src/store";

// const getContacts =
//   (): AppThunk =>
//   async (dispatch): Promise<void> => {
//     const response = await chatApi.getContacts({});

//     dispatch(slice.actions.getContacts(response));
//   };

// const getThreads =
//   (): AppThunk =>
//   async (dispatch): Promise<void> => {
//     const response = await chatApi.getThreads();

//     dispatch(slice.actions.getThreads(response));
//   };

// type GetThreadParams = {
//   threadKey: string;
// };

// const getThread =
//   (params: GetThreadParams): AppThunk =>
//   async (dispatch): Promise<string | undefined> => {
//     const response = await chatApi.getThread(params);

//     dispatch(slice.actions.getThread(response));

//     return response?.id;
//   };

// type MarkThreadAsSeenParams = {
//   threadId: string;
// };

// const markThreadAsSeen =
//   (params: MarkThreadAsSeenParams): AppThunk =>
//   async (dispatch): Promise<void> => {
//     await chatApi.markThreadAsSeen(params);

//     dispatch(slice.actions.markThreadAsSeen(params.threadId));
//   };

// type SetCurrentThreadParams = {
//   threadId?: string;
// };

// const setCurrentThread =
//   (params: SetCurrentThreadParams): AppThunk =>
//   (dispatch): void => {
//     dispatch(slice.actions.setCurrentThread(params.threadId));
//   };

// type AddMessageParams = {
//   threadId?: string;
//   recipientIds?: string[];
//   body: string;
// };

// const addMessage =
//   (params: AddMessageParams): AppThunk =>
//   async (dispatch): Promise<string> => {
//     const response = await chatApi.addMessage(params);

//     dispatch(slice.actions.addMessage(response));

//     return response.threadId;
//   };

// export const thunks = {
//   addMessage,
//   getContacts,
//   getThread,
//   getThreads,
//   markThreadAsSeen,
//   setCurrentThread,
// };

import { chatApi } from "src/api/chat";
import { slice } from "src/store/slices/chat";
import type { AppThunk } from "src/store";
import { threadApi } from "src/api/chat/thread";

const getContacts =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await chatApi.getContacts({});

    dispatch(slice.actions.getContacts(response));
  };

const getThreads =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await threadApi.getAllThreads();

    console.log("api thread response", response.data);

    dispatch(slice.actions.getThreads(response.data));
  };

// type GetThreadParams = {
//   threadId: string;
// };

const getThread =
  (threadId: string): AppThunk =>
  async (dispatch): Promise<string | undefined> => {
    const response = await threadApi.getThreadbyId(threadId);

    dispatch(slice.actions.getThread(response.data));

    return response.data;
  };

type MarkThreadAsSeenParams = {
  threadId: string;
};

const markThreadAsSeen =
  (params: MarkThreadAsSeenParams): AppThunk =>
  async (dispatch): Promise<void> => {
    await chatApi.markThreadAsSeen(params);

    dispatch(slice.actions.markThreadAsSeen(params.threadId));
  };

type SetCurrentThreadParams = {
  threadId?: string;
};

const setCurrentThread =
  (params: SetCurrentThreadParams): AppThunk =>
  (dispatch): void => {
    dispatch(slice.actions.setCurrentThread(params.threadId));
  };

type AddMessageParams = {
  threadId?: string;
  recipientIds?: string[];
  body: string;
  contentType: string;
};

const addMessage =
  (params: AddMessageParams): AppThunk =>
  async (dispatch): Promise<string> => {
    const response = await threadApi.sendMessage(params);

    console.log("response", response);

    dispatch(slice.actions.addMessage(response.data));

    return response.data._id;
  };

export const thunks = {
  addMessage,
  getContacts,
  getThread,
  getThreads,
  markThreadAsSeen,
  setCurrentThread,
};
