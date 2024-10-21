import { calendarApi } from "src/api/calendar";
import { slice } from "src/store/slices/calendar";
import type { AppThunk } from "src/store";
import { meetingApi } from "src/api";
import { TaskApi } from "src/api/kanban/tasks";
import { useWorkSpace } from "src/hooks/use-workSpace";

const getEvents =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await calendarApi.getEvents();

    dispatch(slice.actions.getEvents(response));
  };

type CreateEventParams = {
  eventType: string;
  values: any;
};

const createEvent =
  (params: CreateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    const baseEvent = {
      id: params.values._id,
      start: new Date(params.values.dueDate).getTime(),
      end: new Date(params.values.dueDate).getTime() + 1 * 60 * 60 * 1000,
      title: params.values.title,
      type: params.eventType,
      color: "#F79009",
      details: params.values,
    };

    let createdEvent = { ...baseEvent };

    if (params.eventType === "meeting") {
      const response = await meetingApi.createMeeting(params.values);

      createdEvent = {
        ...createdEvent,
        id: response.data._id,
        end: new Date(params.values.time).getTime() + 1 * 60 * 60 * 1000,
        color: "#0a8263",
        details: response.data,
      };
    } else if (params.eventType === "task") {
    }

    dispatch(slice.actions.createEvent(createdEvent));
  };

type UpdateEventParams = {
  eventId: string;
  eventType: string;
  update: any;
};

const updateEvent =
  (params: UpdateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    const baseEvent: any = {
      id: params.eventId,
      title: params.update.title,
      type: params.eventType,
      details: params.update,
      color: "#F79009",
      start: new Date(params.update.dueDate).getTime(),
      end: new Date(params.update.dueDate).getTime() + 1 * 60 * 60 * 1000,
    };

    let updatedEvent = { ...baseEvent };

    if (params.eventType === "meeting") {
      const response = await meetingApi.updateMeeting(
        params.eventId as string,
        params.update
      );
      updatedEvent = {
        ...updatedEvent,
        end: new Date(params.update.time).getTime() + 2 * 60 * 60 * 1000,
        color: "#0a8263",
        details: response.data,
      };
    }

    // Dispatch the updated event
    dispatch(slice.actions.updateEvent(updatedEvent));
  };

type DeleteEventParams = {
  eventId: string;
  eventType: string;
};

const deleteEvent =
  (params: DeleteEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    if (params.eventType === "meeting") {
      await meetingApi.deleteMeeting(params.eventId);
    }
    dispatch(slice.actions.deleteEvent(params.eventId));
  };

export const thunks = {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
};
