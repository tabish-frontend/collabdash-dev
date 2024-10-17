import { calendarApi } from "src/api/calendar";
import { slice } from "src/store/slices/calendar";
import type { AppThunk } from "src/store";
import { CalendarEvent } from "src/types/calendar";
import { Meeting, Tasks } from "src/types";
import { meetingApi } from "src/api";

const getEvents =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await calendarApi.getEvents();

    dispatch(slice.actions.getEvents(response));
  };

type CreateEventParams = {
  end: number;
  start: number;
  title: string;
};

const createEvent =
  (params: CreateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await calendarApi.createEvent(params);

    dispatch(slice.actions.createEvent(response));
  };

type UpdateEventParams = {
  eventId: string;
  eventType: string;
  update: any;
};

const updateEvent =
  (params: UpdateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    let updatedEvenet: any;
    if (params.eventType === "task") {
      updatedEvenet = {
        id: params.eventId,
        start: new Date(params.update.dueDate).getTime(),
        end: new Date(params.update.dueDate).getTime() + 1 * 60 * 60 * 1000,
        title: params.update.title,
        type: params.eventType,
        color: "#F79009",
        details: params.update,
      };
    } else if (params.eventType === "meeting") {
      const response = await meetingApi.updateMeeting(
        params.eventId as string,
        params.update
      );
      updatedEvenet = {
        id: params.eventId,
        start: params.update.time,
        end:
          new Date(params.update.time as Date).getTime() + 2 * 60 * 60 * 1000,
        title: params.update.title,
        type: params.eventType,
        color: "#0a8263",
        details: response.data,
      };
    }

    dispatch(slice.actions.updateEvent(updatedEvenet));
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
