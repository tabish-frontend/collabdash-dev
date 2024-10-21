import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Checkbox,
  ListItemIcon,
  ListItemButton,
  Stack,
  Input,
  Button,
  SvgIcon,
  LinearProgress,
  TextField,
  Divider,
} from "@mui/material";
import { Attachment, AccessTime } from "@mui/icons-material";
import FlagIcon from "@mui/icons-material/Flag";
import { Scrollbar } from "src/utils/scrollbar";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import { todosApi } from "src/api";
import { formatDate } from "src/utils";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  date: Date;
}

export const TodoCard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingId, setEditingId] = useState<string>("");
  const [editText, setEditText] = useState("");
  const [queryDate, setQueryDate] = useState<Date>(new Date());

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const currentYear = new Date().getFullYear();

  const handleNext = () => {
    setQueryDate((prevDate) => dayjs(prevDate).add(1, "day").toDate());
  };

  const handlePrevious = () => {
    setQueryDate((prevDate) => dayjs(prevDate).subtract(1, "day").toDate());
  };

  const handleChangeDate = (date: any) => {
    if (date) {
      setQueryDate(date);
    }
  };

  useEffect(() => {
    updateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  const updateProgress = () => {
    const completedTasks = todos.filter((todo) => todo.completed).length;
    const totalTasks = todos.length;
    setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const response = await todosApi.addTodos({
        title: newTodo,
        date: queryDate,
      });
      setTodos([...todos, response]);
      setNewTodo("");
      setShowInput(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    const updatedTodos = await Promise.all(
      todos.map(async (todo) => {
        if (todo._id === id) {
          // Call the API to update the todo
          const response = await todosApi.updateTodo(id, {
            completed: !todo.completed,
          });
          // Update the todo item in the state based on the API response
          return { ...todo, completed: response.completed };
        }
        return todo; // Return the todo unchanged if id doesn't match
      })
    );

    // Update the state after all API calls are done
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = async (id: string) => {
    await todosApi.deleteTodo(id);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const handleEditTodo = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = async (id: string) => {
    if (id) {
      const response = await todosApi.updateTodo(id, { title: editText });
      setTodos(todos.map((todo) => (todo._id === id ? response : todo)));
      setEditingId("");
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId("");
    setEditText("");
  };

  const handleCancelAdd = () => {
    setNewTodo("");
    setShowInput(false);
  };

  const getTodos = async () => {
    const response = await todosApi.getTodos(queryDate);
    setTodos(response);
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDate]);

  return (
    <>
      <Card sx={{ minHeight: 490 }}>
        <CardHeader
          //   sx={{ padding: isSmallScreen ? "28px 20px" : "28px 24px" }}
          title="My Todos"
          action={
            <Stack
              direction={"row"}
              justifyContent="space-between"
              spacing={{
                xs: 0,
                lg: 4,
              }}
            >
              <Stack direction={"row"}>
                <IconButton onClick={handlePrevious} sx={{ padding: "4px" }}>
                  <SvgIcon>
                    <ChevronLeft />
                  </SvgIcon>
                </IconButton>

                <IconButton onClick={handleNext} sx={{ padding: "4px" }}>
                  <SvgIcon>
                    <ChevronRight />
                  </SvgIcon>
                </IconButton>
              </Stack>

              <DatePicker
                value={queryDate}
                label={"Select Date"}
                views={["year", "month", "day"]}
                minDate={new Date(currentYear - 3, 0, 1)}
                maxDate={new Date(currentYear, 11, 31)}
                sx={{ maxWidth: isSmallScreen ? 130 : 160, height: 45 }}
                onChange={handleChangeDate}
              />
            </Stack>
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
            <Card sx={{ maxWidth: 600 }} variant="outlined">
              <Stack direction={"column"} p={2} spacing={1}>
                <Typography variant="h6" gutterBottom>
                  {formatDate(queryDate, "D MMM YYYY")}
                </Typography>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Progress: {Math.round(progress)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={theme.palette.mode === "dark" ? "info" : "primary"}
                  />
                </Box>

                {todos.map((todo, index) => (
                  <List sx={{ px: 1, pb: 0 }} key={todo._id}>
                    <ListItem
                      dense
                      sx={{
                        flexDirection: "column",
                        alignItems: "stretch",
                        py: "4px ",
                        px: "0px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo._id)}
                            inputProps={{
                              "aria-labelledby": `todo-${todo._id}`,
                            }}
                            color={
                              theme.palette.mode === "dark" ? "info" : "primary"
                            }
                          />
                        </ListItemIcon>
                        {editingId === todo._id ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexGrow: 1,
                              gap: 1,
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyUp={(e) =>
                                e.key === "Enter" && handleSaveEdit(todo._id)
                              }
                              autoFocus
                              variant="outlined"
                            />
                            <Button
                              variant="contained"
                              color={
                                theme.palette.mode === "dark"
                                  ? "info"
                                  : "primary"
                              }
                              onClick={() => handleSaveEdit(todo._id)}
                              size="small"
                            >
                              Save
                            </Button>
                            <Button
                              variant="text"
                              // color={theme.palette.mode === "dark" ? "info" : "primary"}
                              onClick={handleCancelEdit}
                              size="small"
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "neutral.100"
                                    : "neutral.800",
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <ListItemText
                              id={`todo-${todo._id}`}
                              primary={todo.title}
                              sx={{
                                textDecoration: todo.completed
                                  ? "line-through"
                                  : "none",
                                color: todo.completed
                                  ? "text.secondary"
                                  : "text.primary",
                                flex: 1,
                                cursor: "pointer",
                                p: "6px 14px",
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "neutral.800"
                                      : "neutral.100",
                                  borderRadius: 1,
                                },
                              }}
                              onClick={() =>
                                handleEditTodo(todo._id, todo.title)
                              }
                            />
                          </Box>
                        )}
                        {editingId !== todo._id && (
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteTodo(todo._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  </List>
                ))}
              </Stack>

              <Divider />

              {showInput ? (
                <Box sx={{ display: "flex", gap: 1, p: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new task"
                    onKeyUp={(e) => e.key === "Enter" && handleAddTodo()}
                  />
                  <Button
                    variant="contained"
                    color={theme.palette.mode === "dark" ? "info" : "primary"}
                    onClick={handleAddTodo}
                    size="small"
                  >
                    Add
                  </Button>
                  <Button
                    variant="text"
                    // color={theme.palette.mode === "dark" ? "info" : "primary"}
                    onClick={handleCancelAdd}
                    size="small"
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? "neutral.100"
                          : "neutral.800",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : null}

              {!showInput && (
                <Box p={2}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setShowInput(true)}
                    variant="text"
                    color={theme.palette.mode === "dark" ? "info" : "primary"}
                    size="small"
                  >
                    Add New Task
                  </Button>
                </Box>
              )}
            </Card>
          </CardContent>
        </Scrollbar>
      </Card>
    </>
  );
};
