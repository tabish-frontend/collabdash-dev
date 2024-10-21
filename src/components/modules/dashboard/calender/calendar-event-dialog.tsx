import type { FC } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { TabContext, TabList } from "@mui/lab";
import { styled, TabProps } from "@mui/material";
import MuiTab from "@mui/material/Tab";
import { CreateTaskEvent } from "./new-task";
import { CreateMeetingEvent } from "./new-meetinf";

const StyledTab = styled(MuiTab)<TabProps>(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    padding: "12px",
  },
}));

interface CalendarEventDialogProps {
  onAddComplete?: () => void;
  onClose?: () => void;
  open?: boolean;
  range?: { start: number };
}

export const CreateEventDialog: FC<CalendarEventDialogProps> = (props) => {
  const { onAddComplete, onClose, open = false, range } = props;

  const [eventType, setEventType] = useState("meeting");

  const handleEventChange = (event: React.SyntheticEvent, newValue: string) => {
    setEventType(newValue);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <Box sx={{ p: 2 }}>
        <TabContext value={eventType}>
          <TabList onChange={handleEventChange} aria-label="form tabs">
            <StyledTab label="Create Meeting" value="meeting" />
            <StyledTab label="Create Task" value="task" />
          </TabList>
        </TabContext>
      </Box>

      {eventType === "task" && (
        <CreateTaskEvent
          onAddComplete={onAddComplete}
          onClose={onClose}
          range={range}
        />
      )}

      {eventType === "meeting" && (
        <CreateMeetingEvent
          onAddComplete={onAddComplete}
          onClose={onClose}
          range={range}
        />
      )}
    </Dialog>
  );
};

CreateEventDialog.propTypes = {
  // @ts-ignore
  onAddComplete: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  range: PropTypes.object,
};
