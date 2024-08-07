import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/shared/seo";
import { DashboardLayout } from "src/layouts";
import { TaskModal } from "./task-modal";
import { ColumnCard } from "./column-card";
import { ColumnAdd } from "./column-add";
import { useDispatch, useSelector } from "src/store";
import { thunks } from "src/thunks/kanban";
import { Button, Container, SvgIcon, Tooltip } from "@mui/material";
import { useSettings } from "src/hooks";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { Scrollbar } from "src/utils/scrollbar";
import { minHeight } from "@mui/system";
import { useWorkSpace } from "src/hooks/use-workSpace";
import {
  WorkSpaceBoard,
  WorkSpaceBoardColumn,
  WorkSpaceBoardColumnTasks,
} from "src/types";

const formatSlug = (slug: string | string[] | undefined): string => {
  if (typeof slug === "string") {
    return slug.split("_").join(" ");
  }
  return "";
};

const BoardComponent = () => {
  const dispatch = useDispatch();
  // const columnsIds = useColumnsIds();
  const [currentTaskId, setCurrentTaskId] =
    useState<WorkSpaceBoardColumnTasks | null>(null);

  const settings = useSettings();
  const router = useRouter();

  const { workspace_slug } = router.query;
  const { boards_slug } = router.query;

  const {
    WorkSpaces,
    getCurrentBoard,
    handleAddColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleMoveColumn,
    handleAddTask,
  } = useWorkSpace();

  const workSpaceBoard: WorkSpaceBoard = getCurrentBoard(
    workspace_slug,
    boards_slug
  );

  console.log("workSpaceBoard", workSpaceBoard);

  const handleDragEnd = useCallback(
    async ({
      source,
      destination,
      draggableId,
      type,
    }: DropResult): Promise<void> => {
      if (!destination) return;

      handleMoveColumn({
        board_id: workSpaceBoard._id,
        column_id: draggableId,
        index: destination.index,
      });

      // if (
      //   source.droppableId === destination.droppableId &&
      //   source.index === destination.index
      // ) {
      //   return;
      // }

      // try {
      //   if (type === "COLUMN") {
      //     handleMoveColumn({
      //       board_id: workSpaceBoard._id,
      //       column_id: draggableId,
      //       index: destination.index,
      //     });
      //   } else {
      //     if (source.droppableId === destination.droppableId) {
      //       // await dispatch(
      //       //   thunks.moveTask({
      //       //     taskId: draggableId,
      //       //     position: destination.index,
      //       //   })
      //       // );
      //     } else {
      //       // await dispatch(
      //       //   thunks.moveTask({
      //       //     taskId: draggableId,
      //       //     position: destination.index,
      //       //     columnId: destination.droppableId,
      //       //   })
      //       // );
      //     }
      //   }
      // } catch (err) {
      //   console.error(err);
      //   toast.error("Something went wrong!");
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workSpaceBoard]
  );

  const handleColumnClear = useCallback(
    async (columnId: string): Promise<void> => {
      try {
        await dispatch(
          thunks.clearColumn({
            columnId,
          })
        );
        toast.success("Column cleared");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch]
  );

  // const handleTaskAdd = useCallback(
  //   async (columnId: string, name?: string): Promise<void> => {
  //     try {
  //       await dispatch(
  //         thunks.createTask({
  //           columnId,
  //           name: name || "Untitled Task",
  //         })
  //       );
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Something went wrong!");
  //     }
  //   },
  //   [dispatch]
  // );

  const handleTaskOpen = useCallback(
    (task: WorkSpaceBoardColumnTasks): void => {
      setCurrentTaskId(task);
    },
    []
  );

  const handleTaskClose = useCallback((): void => {
    setCurrentTaskId(null);
  }, []);

  useEffect(() => {
    console.log("currentTaskId", currentTaskId);
  }, [currentTaskId]);

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
            {`${formatSlug(workspace_slug)} - ${formatSlug(boards_slug)}`}
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
                              onClear={() => handleColumnClear(column._id)}
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
        open={!!currentTaskId}
        task={currentTaskId || undefined}
        boardColumns={workSpaceBoard?.columns}
      />
    </>
  );
};

const Board: NextPage = () => {
  return <BoardComponent />;
};

Board.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { Board };
