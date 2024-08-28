import { useCallback, useState } from "react";
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
import { Button, SvgIcon, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { WorkSpaceBoardColumn, WorkSpaceBoardColumnTasks } from "src/types";

const BoardComponent = () => {
  const [currentTask, setCurrentTask] =
    useState<WorkSpaceBoardColumnTasks | null>(null);

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

  const handleTaskOpen = useCallback(
    (task: WorkSpaceBoardColumnTasks): void => {
      setCurrentTask(task);
    },
    []
  );

  const handleTaskClose = useCallback((): void => {
    setCurrentTask(null);
  }, []);

  console.log("Workspace Board", workSpaceBoard);

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
        <Box display="flex" alignItems={"center"}>
          <Tooltip title="Back">
            <Button onClick={() => router.back()} color="inherit" size="small">
              <SvgIcon>
                <ArrowLeftIcon />
              </SvgIcon>
            </Button>
          </Tooltip>
          <Typography variant="h5">{"Tasks"}</Typography>
        </Box>

        <Box sx={{ px: 3, py: 3 }}>
          <Typography variant="h6" textTransform={"capitalize"}>
            {`${workSpaceBoard?.workspace.name} - ${workSpaceBoard?.name}`}
          </Typography>
        </Box>

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
                    (column: WorkSpaceBoardColumn, index: number) => (
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
                              column={column}
                              onClear={() => handleClearColumn(column._id)}
                              onDelete={() => handleDeleteColumn(column._id)}
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
