import { calendarApi } from "src/api/calendar";
import { slice } from "src/store/slices/calendar";
import type { AppThunk } from "src/store";
import {
  CalendarView,
  CalenderStudentInfo,
  CalenderTeacherInfo,
  classroomStats,
} from "src/types/calendar";

const getEvents =
  (sessions: any): AppThunk =>
  async (dispatch): Promise<void> => {
    let response: any = await calendarApi.getEvents(sessions);

    // response = response.data.schedules;

    dispatch(slice.actions.getEvents(response));
  };

type CreateEventParams = {
  end: number;
  start: number;
  title: string;
  base: boolean;
  teacher: CalenderTeacherInfo;
  students: CalenderStudentInfo[];
  meeting_url: string;
  meeting_account: string;
  resource_drive_url: string;
  classroom_engagement_stats: classroomStats;
  subject: string;

  pause?: boolean;
  is_charge: boolean;
  cancelled_before?: string;
  pause_by?: string;
};

const createEvent =
  (params: CreateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await calendarApi.createEvent(params);

    dispatch(slice.actions.createEvent(response));
  };

type UpdateEventParams = {
  eventId: string;
  update: {
    end?: number;
    start?: number;
    title?: string;
    pause?: boolean;
    pause_by?: string;
    reason?: string;
    teacher?: CalenderTeacherInfo;
    students?: CalenderStudentInfo[];
    meeting_url?: string;
    meeting_account?: string;
    subject?: string;
    is_charge?: boolean;
    resource_drive_url?: string;
    classroom_engagement_stats?: classroomStats;
  };
  events: [
    {
      id: string;
      end: number;
      start: number;
      title: string;
      base: boolean;
      is_charge: boolean;
      cancelled_by: string;
      reason: string;
      teacher: {
        teacher: string;
        fee_period: string;
        fee: null | number;
      };
      students: CalenderStudentInfo[];
      meeting_url: string;
      meeting_account: string;
      subject: string;
      resource_drive_url: string;
      classroom_engagement_stats: classroomStats;
    }
  ];
};

const updateEvent =
  (params: UpdateEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await calendarApi.updateEvent(params);

    dispatch(slice.actions.updateEvent(response));
  };

type DeleteEventParams = {
  eventId: string;
  events: [
    {
      id: string;
      end: number;
      start: number;
      title: string;
      base: boolean;
      cancelled_by: string;
      reason: string;
    }
  ];
};

const deleteEvent =
  (params: DeleteEventParams): AppThunk =>
  async (dispatch): Promise<void> => {
    await calendarApi.deleteEvent(params);

    dispatch(slice.actions.deleteEvent(params.eventId));
  };

export const thunks = {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
};
