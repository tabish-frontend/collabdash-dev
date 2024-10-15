import { Tasks } from "./kanban";
import { Meeting } from "./meeting";

export interface CalendarEvent {
  id: string;
  end: number;
  start: number;
  title: string;
  color: string;
  type: string;
  details?: Tasks | Meeting;
}

export type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek";
