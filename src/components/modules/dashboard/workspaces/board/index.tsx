import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DashboardLayout } from "src/layouts";
import { TaskModal } from "./task-modal";
import { ColumnCard } from "./column-card";
import { ColumnAdd } from "./column-add";
import { Avatar, Button, Container, SvgIcon, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { Column, Tasks } from "src/types";
import { useSettings } from "src/hooks";

const BoardComponent = () => {
  const [currentTask, setCurrentTask] = useState<Tasks | null>(null);
  const settings = useSettings();

  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const handleSelectedAssignee = (_id: string) => {
    if (_id === "unassigned") {
      // Toggle "Unassigned" selection
      if (selectedAssignee === "unassigned") {
        setSelectedAssignee(null); // Deselect if already selected
      } else {
        setSelectedAssignee("unassigned"); // Set "Unassigned" as the selected value
      }
    } else {
      // Toggle the active avatar based on the clicked user
      if (selectedAssignee === _id) {
        setSelectedAssignee(null); // Deselect if the same avatar is clicked
      } else {
        setSelectedAssignee(_id); // Set the clicked avatar as active
      }
    }
  };

  const router = useRouter();

  const { workspace_slug } = router.query;
  const { boards_slug } = router.query;

  const {
    getCurrentBoard,
    handleAddColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleClearColumn,
    handleMoveColumn,
    handleAddTask,
    handleMoveTask,
  } = useWorkSpace();

  const workSpaceBoard = getCurrentBoard(workspace_slug, boards_slug);

  const handleDragEnd = useCallback(
    async ({
      source,
      destination,
      draggableId,
      type,
    }: DropResult): Promise<void> => {
      if (!destination) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      try {
        if (type === "COLUMN") {
          handleMoveColumn({
            board_id: workSpaceBoard._id,
            column_id: draggableId,
            index: destination.index,
          });
        } else {
          if (source.droppableId === destination.droppableId) {
            handleMoveTask({
              task_id: draggableId,
              index: destination.index,
            });
          } else {
            handleMoveTask({
              task_id: draggableId,
              index: destination.index,
              column_id: destination.droppableId,
            });
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workSpaceBoard]
  );

  const handleTaskOpen = useCallback((task: Tasks): void => {
    setCurrentTask(task);
  }, []);

  const handleTaskClose = useCallback((): void => {
    setCurrentTask(null);
  }, []);

  const filterTasksByAssignee = (column: Column, assigneeId: string | null) => {
    // If assigneeId is null, filter tasks that have no assignees
    if (assigneeId === "unassigned") {
      const unassignedTasks = column.tasks.filter(
        (task) => task.assignedTo.length === 0
      );
      return {
        ...column,
        tasks: unassignedTasks,
      };
    }

    // If assigneeId is provided, filter tasks based on the given assigneeId
    if (assigneeId) {
      const filteredTasks = column.tasks.filter((task) =>
        task.assignedTo.some((assignee) => assignee._id === assigneeId)
      );

      return {
        ...column,
        tasks: filteredTasks,
      };
    }

    // If no assigneeId is provided, return the original column with all tasks
    return column;
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          pt: 4,
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Stack
            spacing={{
              xs: 2,
              lg: 2,
            }}
          >
            <Box display="flex" alignItems={"center"}>
              <Tooltip title="Back">
                <Button
                  onClick={() => router.back()}
                  color="inherit"
                  size="small"
                >
                  <SvgIcon>
                    <ArrowLeftIcon />
                  </SvgIcon>
                </Button>
              </Tooltip>
              <Typography variant="h5">{"Tasks"}</Typography>
            </Box>

            <Box sx={{ px: 3, py: 3 }}>
              <Typography variant="h5" textTransform={"capitalize"}>
                {`${workSpaceBoard?.workspace.name} - ${workSpaceBoard?.name}`}
              </Typography>
            </Box>

            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              sx={{ px: 3 }}
              spacing={0.5}
            >
              {workSpaceBoard?.members.map((user: any, index: number) => (
                <Tooltip key={index} title={user.full_name} arrow>
                  <Avatar
                    src={user.avatar}
                    alt={user.full_name}
                    onClick={() => handleSelectedAssignee(user._id)}
                    sx={{
                      width: 50,
                      height: 50,
                      cursor: "pointer",
                      border:
                        selectedAssignee === user._id
                          ? "3px solid #06aed4"
                          : "none",
                    }}
                  />
                </Tooltip>
              ))}

              <Tooltip key="unassigned" title="Unassigned" arrow>
                <Stack
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectedAssignee("unassigned")}
                >
                  <Avatar
                    alt="Unassigned"
                    sx={{
                      width: 50,
                      height: 50,
                      border:
                        selectedAssignee === "unassigned"
                          ? "3px solid #06aed4"
                          : "none",
                    }}
                  >
                    U
                  </Avatar>
                </Stack>
              </Tooltip>
            </Stack>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="COLUMN"
              >
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      flexShrink: 1,
                      overflowX: "auto",
                      overflowY: "hidden",
                      px: 3,
                      py: 3,
                    }}
                  >
                    <Stack alignItems="flex-start" direction="row" spacing={1}>
                      {workSpaceBoard?.columns.map(
                        (column: Column, index: number) => (
                          <Draggable
                            draggableId={column._id}
                            index={index}
                            key={column._id}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ColumnCard
                                  column={filterTasksByAssignee(
                                    column,
                                    selectedAssignee
                                  )}
                                  onClear={() => handleClearColumn(column._id)}
                                  onDelete={() =>
                                    handleDeleteColumn(column._id)
                                  }
                                  onRename={(name) =>
                                    handleUpdateColumn(column._id, {
                                      name,
                                    })
                                  }
                                  onTaskAdd={(name) =>
                                    handleAddTask({
                                      title: name || "Untitled Task",
                                      column: column._id,
                                      board: workSpaceBoard._id,
                                    })
                                  }
                                  onTaskOpen={handleTaskOpen}
                                />
                              </Box>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                      <ColumnAdd
                        onAdd={(name) =>
                          handleAddColumn({
                            name: name || "Untitled Column",
                            board: workSpaceBoard._id,
                          })
                        }
                      />
                    </Stack>
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </Container>
      </Box>
      <TaskModal
        onClose={handleTaskClose}
        open={!!currentTask}
        task={currentTask || undefined}
        boardColumns={workSpaceBoard?.columns}
        boardMembers={workSpaceBoard?.members}
      />
    </>
  );
};

const Board: NextPage = () => {
  return <BoardComponent />;
};

Board.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Board };
