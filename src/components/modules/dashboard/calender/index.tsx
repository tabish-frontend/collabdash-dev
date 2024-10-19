import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NextPage } from "next";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { useDialog } from "src/hooks/use-dialog";
import { usePageView } from "src/hooks/use-page-view";
import { DashboardLayout } from "src/layouts/dashboard";
// import { CalendarEventDialog } from "./calendar-event-dialog";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarContainer } from "./calendar-container";
import { useDispatch, useSelector } from "src/store";
import { thunks } from "src/thunks/calendar";
import type { CalendarEvent, CalendarView } from "src/types/calendar";
import { ConfirmationModal, TaskModal } from "src/components/shared";
import { Meeting, Tasks } from "src/types";
import { MeetingCard } from "../meetings/meetingCard";
import { Dialog } from "@mui/material";
import { MeetingModal } from "../meetings/meeting-modal";
import { CreateEventDialog } from "./calendar-event-dialog";
import dayjs from "dayjs";

interface VieweDialogData {
  eventId?: string;
}

interface CreateDialogData {
  range?: {
    start: number;
  };
}

interface UpdateDialogData {
  eventId?: string;
}

interface DeleteDialogData {
  eventId?: string;
}

const useEvents = (): CalendarEvent[] => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.calendar.events);

  const handleEventsGet = useCallback((): void => {
    dispatch(thunks.getEvents());
  }, [dispatch]);

  useEffect(
    () => {
      handleEventsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return events;
};

const useCurrentEvent = (
  events: CalendarEvent[],
  dialogData?: UpdateDialogData
): CalendarEvent | undefined => {
  return useMemo((): CalendarEvent | undefined => {
    if (!dialogData) {
      return undefined;
    }

    return events.find((event) => event.id === dialogData!.eventId);
  }, [dialogData, events]);
};

const CalenderComponentScreen = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<Calendar | null>(null);
  const events = useEvents();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>(
    mdUp ? "timeGridDay" : "timeGridWeek"
  );

  const viewDialog = useDialog<VieweDialogData>();
  const viewEvent = useCurrentEvent(events, viewDialog.data);

  const createDialog = useDialog<CreateDialogData>();

  const updateDialog = useDialog<UpdateDialogData>();
  const updatingEvent = useCurrentEvent(events, updateDialog.data);

  const deleteDialog = useDialog<DeleteDialogData>();

  usePageView();

  const handleScreenResize = useCallback((): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mdUp ? "timeGridWeek" : "timeGridDay";

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarRef, mdUp]);

  useEffect(
    () => {
      handleScreenResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mdUp]
  );

  const handleViewChange = useCallback((view: CalendarView): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(view);
      setView(view);
    }
  }, []);

  const handleDateToday = useCallback((): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleDatePrev = useCallback((): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleDateNext = useCallback((): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleAddClick = useCallback((): void => {
    createDialog.handleOpen();
  }, [createDialog]);

  const handleRangeSelect = useCallback(
    (arg: DateSelectArg): void => {
      const calendarEl = calendarRef.current;

      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.unselect();
      }

      createDialog.handleOpen({
        range: {
          start: arg.start.getTime(),
        },
      });
    },
    [createDialog]
  );

  const handleEventSelect = useCallback(
    (arg: EventClickArg): void => {
      viewDialog.handleOpen({
        eventId: arg.event.id,
      });
    },
    [viewDialog]
  );

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!deleteDialog.data) {
      return;
    }

    try {
      await dispatch(
        thunks.deleteEvent({
          eventId: deleteDialog.data!.eventId as string,
          eventType: "meeting",
        })
      );
      deleteDialog.handleClose();
      viewDialog.handleClose();
    } catch (err) {
      console.error(err);
    }
  }, [deleteDialog, dispatch, viewDialog]);

  const handleUpdate = useCallback(
    async (values: Meeting): Promise<void> => {
      if (!updatingEvent) {
        return;
      }

      try {
        await dispatch(
          thunks.updateEvent({
            eventId: updatingEvent.id,
            eventType: "meeting",
            update: values,
          })
        );
        updateDialog.handleClose();
        viewDialog.handleClose();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, updateDialog, updatingEvent, viewDialog]
  );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <CalendarToolbar
              date={date}
              onAddClick={handleAddClick}
              onDateNext={handleDateNext}
              onDatePrev={handleDatePrev}
              onDateToday={handleDateToday}
              onViewChange={handleViewChange}
              view={view}
            />
            <Card>
              <CalendarContainer>
                <Calendar
                  dayMaxEventRows={3}
                  height={700}
                  rerenderDelay={10}
                  ref={calendarRef}
                  initialDate={date}
                  initialView={view}
                  events={events}
                  allDaySlot={false}
                  headerToolbar={false}
                  eventStartEditable={false}
                  droppable
                  editable
                  selectable
                  weekends
                  firstDay={dayjs().day()}
                  eventClick={handleEventSelect}
                  select={handleRangeSelect}
                  eventDisplay="block"
                  eventResizableFromStart
                  plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                    listPlugin,
                    timeGridPlugin,
                    timelinePlugin,
                  ]}
                />
              </CalendarContainer>
            </Card>
          </Stack>
        </Container>
      </Box>

      {createDialog.open && (
        <CreateEventDialog
          onAddComplete={createDialog.handleClose}
          onClose={createDialog.handleClose}
          open={createDialog.open}
          range={createDialog.data?.range}
        />
      )}

      {viewDialog.open && viewEvent?.type === "task" && (
        <TaskModal
          onClose={viewDialog.handleClose}
          open={!!viewDialog.open}
          task={viewEvent?.details as Tasks}
        />
      )}

      {viewDialog.open && viewEvent?.type === "meeting" && (
        <Dialog
          onClose={viewDialog.handleClose}
          open={viewDialog.open}
          maxWidth="sm"
          fullWidth
        >
          <MeetingCard
            meeting={viewEvent.details as Meeting}
            isUpcomingMeetings={true}
            handleUpdateMeeting={() => {
              updateDialog.handleOpen({
                eventId: viewEvent.id,
              });
            }}
            handleDeleteMeeting={() =>
              deleteDialog.handleOpen({
                eventId: viewEvent.id,
              })
            }
          />
        </Dialog>
      )}

      {updateDialog.open && updatingEvent?.type === "meeting" && (
        <MeetingModal
          modalType={"Update"}
          modal={updateDialog.open}
          meetingValues={updatingEvent.details as Meeting}
          onCancel={updateDialog.handleClose}
          onSubmit={handleUpdate}
        />
      )}

      {deleteDialog.open && (
        <ConfirmationModal
          modal={deleteDialog.open}
          onConfirm={handleDelete}
          onCancel={deleteDialog.handleClose}
          content={{
            type: "Delete Meeting",
            text: `Are you sure you want to delete that meeting? `,
          }}
        />
      )}
    </>
  );
};

const CalenderComponent: NextPage = () => {
  return <CalenderComponentScreen />;
};

CalenderComponent.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export { CalenderComponent };
