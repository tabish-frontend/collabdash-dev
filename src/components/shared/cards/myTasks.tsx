import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItemText,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  SvgIcon,
  TextField,
  MenuItem,
  Link,
} from "@mui/material";
import { Attachment, AccessTime } from "@mui/icons-material";
import FlagIcon from "@mui/icons-material/Flag";
import { Scrollbar } from "src/utils/scrollbar";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { useAuth, useDialog } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { SeverityPill } from "../severity-pill";
import { RouterLink } from "../router-link";
import { paths } from "src/constants/paths";
import { Contact } from "src/types";
import { TaskModal } from "src/components/shared/modals/task-modal";

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  priority: "low" | "moderate" | "high";
  attachments: [];
  columnName: string;
  createdAt: any;
  boardMembers: Contact[];
}

interface TaskDialogData {
  values: any;
}

const filterValues = [
  {
    label: "Recent Tasks",
    value: "createdAt",
  },
  {
    label: "Deadline",
    value: "dueDate",
  },
  {
    label: "Priority",
    value: "priority",
  },
];

export const MyTasksCard = ({
  cardHeight = 490,
  userId,
}: {
  cardHeight?: number;
  userId: string;
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("createdAt");

  const { getAllTasksForUser, isLoading } = useWorkSpace();

  const taskDialog = useDialog<TaskDialogData>();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const tasksForUser = getAllTasksForUser(userId, filter);
    setTasks(tasksForUser);
  }, [userId, filter, getAllTasksForUser]);

  const getPriorityColor = (priority: Task["priority"], theme: any) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "moderate":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <Card
        sx={{
          minHeight: cardHeight,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title="My Tasks"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
          subheader={
            <Link
              component={RouterLink}
              href={paths.workspaces}
              underline="hover"
            >
              <Typography variant="subtitle2">View All Workspaces</Typography>
            </Link>
          }
          action={
            <TextField
              fullWidth
              id="filter-select"
              select
              label="Sort By"
              variant="outlined"
              sx={{
                minWidth: 150,
              }}
              size="small"
              value={filter}
              onChange={handleFilterChange}
            >
              {filterValues.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          }
        />

        <Scrollbar sx={{ maxHeight: 400, overflowY: "auto" }}>
          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: isSmallScreen ? "22px 20px" : "22px 24px 22px 24px",
            }}
          >
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={360}
              >
                <CircularProgress />
              </Box>
            ) : !tasks.length ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <Typography variant="h6" textAlign="center">
                  No Tasks Found
                </Typography>
              </Box>
            ) : (
              tasks.map((task) => (
                <List disablePadding key={task._id} sx={{ mb: 1 }}>
                  <Stack direction={"column"} spacing={1}>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        alignItems: isSmallScreen ? "flex-start" : "center",
                        padding: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        taskDialog.handleOpen({
                          values: task,
                        });
                      }}
                    >
                      <Stack
                        direction={isSmallScreen ? "column" : "row"}
                        justifyContent={"space-between"}
                        alignItems={isSmallScreen ? "flex-start" : "center"}
                        width={"100%"}
                      >
                        <Box sx={{ mr: 2, minWidth: "50%" }}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={2}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              {task.title}
                            </Typography>

                            <SeverityPill color="info">
                              {task.columnName}
                            </SeverityPill>
                          </Stack>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <AccessTime
                              fontSize="small"
                              color="action"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Due {formatDate(task.dueDate)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isSmallScreen
                              ? "space-between"
                              : "flex-end",
                            width: isSmallScreen ? "100%" : "auto",
                            mt: isSmallScreen ? 2 : 0,
                          }}
                        >
                          <Chip
                            icon={
                              <SvgIcon>
                                <FlagIcon sx={{ color: "white" }} />
                              </SvgIcon>
                            }
                            label={
                              task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)
                            }
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(
                                task.priority,
                                theme
                              ),
                              color: "white",
                              fontWeight: "medium",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              mr: 1,
                            }}
                          />

                          {task.attachments && (
                            <IconButton
                              size="small"
                              aria-label={`View ${task.attachments} attachments`}
                              sx={{
                                backgroundColor: theme.palette.background.paper,
                                padding: "6px 12px",
                                borderRadius: 2,
                                color: theme.palette.text.primary,
                              }}
                            >
                              <Attachment fontSize="small" />
                              <Typography
                                variant="caption"
                                sx={{ ml: 0.5, fontWeight: "bold" }}
                              >
                                {task.attachments.length}
                              </Typography>
                            </IconButton>
                          )}
                        </Box>
                      </Stack>
                    </Card>
                  </Stack>
                </List>
              ))
            )}
          </CardContent>
        </Scrollbar>

        {taskDialog.open && (
          <TaskModal
            onClose={taskDialog.handleClose}
            open={taskDialog.open}
            task={taskDialog.data?.values || undefined}
          />
        )}
      </Card>
    </>
  );
};
