import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Attachment, AccessTime } from "@mui/icons-material";
import FlagIcon from "@mui/icons-material/Flag";
import { Scrollbar } from "src/utils/scrollbar";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { SeverityPill } from "../severity-pill";

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  priority: "low" | "moderate" | "high";
  attachments: [];
  columnName: string;
  createdAt: any;
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

export const MyTasksCard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("createdAt");

  const { user } = useAuth<AuthContextType>();

  const { WorkSpaces } = useWorkSpace();

  console.log("Workspaces", WorkSpaces);
  console.log("User: ", user?._id);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const getTasksForUser = (filter: string) => {
    setIsLoading(true);
    let fetchedTasks: Task[] = []; // Initialize a local array for fetched tasks

    WorkSpaces.forEach((workspace: any) => {
      workspace.boards.forEach((board: any) => {
        board.columns.forEach((column: any) => {
          column.tasks.forEach((task: any) => {
            const isUserAssigned = task.assignedTo.some(
              (assignee: any) => assignee._id === user?._id
            );

            if (isUserAssigned) {
              fetchedTasks.push({ ...task, columnName: column.name });
            }
          });
        });
      });
      setIsLoading(false);
    });

    // Sort tasks after collecting them
    fetchedTasks = fetchedTasks.sort((a, b) => {
      switch (filter) {
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ); // Most recent first
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // Earliest due date first
        case "priority":
          const priorityOrder = { high: 1, moderate: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority]; // Priority order
        default:
          return 0;
      }
    });

    setTasks(fetchedTasks); // Set the sorted tasks in state
  };

  useEffect(() => {
    if (user && WorkSpaces) {
      getTasksForUser(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, WorkSpaces, filter]);

  useEffect(() => {
    console.log("Loading", isLoading);
  }, [isLoading]);

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
      <Card sx={{ minHeight: 490, display: "flex", flexDirection: "column" }}>
        <CardHeader
          title="My Tasks"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
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
              value={filter} // Set the current selected value
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
      </Card>
    </>
  );
};
