import { forwardRef } from "react";
import FileCheck03Icon from "@untitled-ui/icons-react/build/esm/FileCheck03";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { Employee, Tasks } from "src/types";
import { Tooltip } from "@mui/material";

interface TaskCardProps {
  task: Tasks;
  dragging?: boolean;
  onOpen?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard(props, ref) {
    const { task, dragging = false, onOpen, ...other } = props;

    if (!task) {
      return null;
    }

    const hasAssignees = task.assignedTo.length > 0;
    const hasAttachments = task.attachments.length > 0;

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
          <>
            {task.attachments[0].type.startsWith("image/") ? (
              <CardMedia
                image={task.attachments[0].url}
                sx={{
                  borderRadius: 1.5,
                  height: 120,
                  mb: 1,
                }}
              />
            ) : (
              <img src="/assets/icons/file.svg" />
            )}
          </>
        )}
        <Typography variant="subtitle1">{task.title}</Typography>

        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          {hasAssignees && (
            <AvatarGroup max={3}>
              {task.assignedTo.map((assignee: Employee) => (
                <Tooltip key={assignee._id} title={assignee.full_name} arrow>
                  <Avatar
                    key={assignee._id}
                    src={assignee.avatar || undefined}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Chip
              key={task.priority}
              label={task.priority}
              size="small"
              sx={{ m: 1 }}
            />

            {hasAttachments && (
              <SvgIcon color="action">
                <FileCheck03Icon />
              </SvgIcon>
            )}
          </Stack>
        </Stack>
      </Card>
    );
  }
);
