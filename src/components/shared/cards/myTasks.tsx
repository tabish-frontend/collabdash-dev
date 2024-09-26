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

interface Task {
  id: string;
  name: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  attachments: number;
}

// Mock API call
const fetchTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Complete project ",
          dueDate: "2024-09-30",
          priority: "high",
          attachments: 2,
        },
        {
          id: "2",
          name: "Review team performance",
          dueDate: "2024-10-05",
          priority: "medium",
          attachments: 0,
        },
        {
          id: "3",
          name: "Prepare for client meeting",
          dueDate: "2024-09-28",
          priority: "high",
          attachments: 3,
        },
        {
          id: "4",
          name: "Update documentation",
          dueDate: "2024-10-10",
          priority: "low",
          attachments: 1,
        },
      ]);
    }, 1000);
  });
};

const filterValues = [
  {
    label: "Recent Tasks",
    value: "recent-tasks",
  },
  {
    label: "Deadline",
    value: "deadline",
  },
  {
    label: "Priority",
    value: "priority",
  },
];

export const MyTasksCard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("recent-tasks");

  // Handle change for the TextField
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setIsLoadingTasks(false);
    });
  }, []);

  const getPriorityColor = (priority: Task["priority"], theme: any) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
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

  const renderTasks = () => {
    return (
      <List disablePadding>
        <Stack direction={"column"} spacing={1}>
          {tasks.map((task) => (
            <Card
              variant="outlined"
              key={task.id}
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                alignItems: isSmallScreen ? "flex-start" : "center",
                padding: 2,
              }}
            >
              {/* Task Title */}
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {task.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <AccessTime
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Due {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                }
                sx={{ mr: 2, minWidth: "50%" }}
              />

              {/* Priority and Attachments */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isSmallScreen ? "space-between" : "flex-end",
                  width: isSmallScreen ? "100%" : "auto",
                  mt: isSmallScreen ? 2 : 0,
                }}
              >
                {/* Priority Chip */}
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
                    backgroundColor: getPriorityColor(task.priority, theme),
                    color: "white",
                    fontWeight: "medium",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    mr: 1,
                  }}
                />

                {/* Attachments Button */}
                {task.attachments > 0 && (
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
                      {task.attachments}
                    </Typography>
                  </IconButton>
                )}
              </Box>
            </Card>
          ))}
        </Stack>
      </List>
    );
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
            {isLoadingTasks ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={360}
              >
                <CircularProgress />
              </Box>
            ) : (
              renderTasks()
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </>
  );
};
