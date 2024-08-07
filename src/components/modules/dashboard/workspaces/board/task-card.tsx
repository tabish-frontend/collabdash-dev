import { forwardRef } from "react";
import PropTypes from "prop-types";
import EyeIcon from "@untitled-ui/icons-react/build/esm/Eye";
import FileCheck03Icon from "@untitled-ui/icons-react/build/esm/FileCheck03";
import ListIcon from "@untitled-ui/icons-react/build/esm/List";
import MessageDotsCircleIcon from "@untitled-ui/icons-react/build/esm/MessageDotsCircle";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import type { RootState } from "src/store";
import { useSelector } from "src/store";
import type { Member, Task } from "src/types/kanban";
import { Employee, WorkSpaceBoardColumnTasks } from "src/types";

const useTask = (taskId: string): Task | undefined => {
  return useSelector((state: RootState) => {
    const { tasks } = state.kanban;

    return tasks.byId[taskId];
  });
};

const useAssignees = (assigneesIds?: string[]): Member[] => {
  return useSelector((state: RootState) => {
    const { members } = state.kanban;

    if (!assigneesIds) {
      return [];
    }

    return assigneesIds
      .map((assigneeId: string) => members.byId[assigneeId])
      .filter((assignee) => !!assignee);
  });
};

interface TaskCardProps {
  task: WorkSpaceBoardColumnTasks;
  dragging?: boolean;
  onOpen?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard(props, ref) {
    const { task, dragging = false, onOpen, ...other } = props;
    // const task = useTask(taskId);
    // const assignees = useAssignees(task?.assigneesIds);

    if (!task) {
      return null;
    }

    const hasAssignees = task.assignedTo.length > 0;
    const hasAttachments = task.assignedTo.length > 0;
    // const hasChecklists = task.checklists.length > 0;
    // const hasComments = task.comments.length > 0;
    // const hasLabels = task.labels.length > 0;

    return (
      <Card
        elevation={dragging ? 8 : 1}
        onClick={onOpen}
        ref={ref}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "background.paper",
          ...(dragging && {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "neutral.800"
                : "background.paper",
          }),
          p: 2,
          userSelect: "none",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.700" : "neutral.50",
          },
          "&.MuiPaper-elevation1": {
            boxShadow: 1,
          },
        }}
        {...other}
      >
        {hasAttachments && (
          <CardMedia
            image={task.attachments[0]}
            sx={{
              borderRadius: 1.5,
              height: 120,
              mb: 1,
            }}
          />
        )}
        <Typography variant="subtitle1">{task.title}</Typography>
        {/* {hasLabels && (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              m: -1,
              mt: 1,
            }}
          >
            {task.labels.map((label) => (
              <Chip key={label} label={label} size="small" sx={{ m: 1 }} />
            ))}
          </Box>
        )} */}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* {task.isSubscribed && (
              <SvgIcon color="action">
                <EyeIcon />
              </SvgIcon>
            )} */}
            {hasAttachments && (
              <SvgIcon color="action">
                <FileCheck03Icon />
              </SvgIcon>
            )}
            {/* {hasChecklists && (
              <SvgIcon color="action">
                <ListIcon />
              </SvgIcon>
            )} */}
            {/* {hasComments && (
              <SvgIcon color="action">
                <MessageDotsCircleIcon />
              </SvgIcon>
            )} */}
          </Stack>
          {hasAssignees && (
            <AvatarGroup max={3}>
              {task.assignedTo.map((assignee: Employee) => (
                <Avatar key={assignee._id} src={assignee.avatar || undefined} />
              ))}
            </AvatarGroup>
          )}
        </Stack>
      </Card>
    );
  }
);

// TaskCard.propTypes = {
//   task: PropTypes.string.isRequired,
//   dragging: PropTypes.bool,
//   onOpen: PropTypes.func,
// };
