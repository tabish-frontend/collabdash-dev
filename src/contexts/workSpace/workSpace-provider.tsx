import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import type { State } from "./workSpace-context";
import { WorkSpaceContext, initialState } from "./workSpace-context";
import { WorkSpace, Board, Employee } from "src/types";
import { WorkSpaceApi } from "src/api/kanban/workSpace";
import { BoardsApi } from "src/api/kanban/boards";
import { ColumnApi } from "src/api/kanban/column";
import { TaskApi } from "src/api/kanban/tasks";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";
import { useSocketContext } from "src/hooks";
import { useDispatch } from "src/store";
import { thunks } from "src/thunks/calendar";

// Utility function to generate slugs
const generateSlug = (name: string) => {
  return name.trim().toLowerCase().replace(/\s+/g, "_").replace(/\//g, "-");
};

// Context provider component
interface WorkSpaceProviderProps {
  children?: ReactNode;
}

export const WorkSpaceProvider: FC<WorkSpaceProviderProps> = ({ children }) => {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { socket } = useSocketContext();
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch WorkSpaces
  const handleGetWorkSpaces = useCallback(async () => {
    setIsLoading(true);
    const response = await WorkSpaceApi.getAllWorkSpaces();
    setState((prev) => ({
      ...prev,
      WorkSpaces: response.data,
    }));
    setIsLoading(false);
  }, []);

  // Get current WorkSpace
  const getCurrentWorkSpace = useCallback(
    (slug: string | string[] | undefined) => {
      return state.WorkSpaces.find((item) => item.slug === slug);
    },
    [state.WorkSpaces]
  );

  // Add WorkSpace
  const handleAddWorkSpace = useCallback(async (data: WorkSpace) => {
    const slug = generateSlug(data.name);
    const dataWithSlug = { ...data, slug };
    const response = await WorkSpaceApi.addWorkSpace(dataWithSlug);
    setState((prev) => ({
      ...prev,
      openModal: false,
      WorkSpaces: [...prev.WorkSpaces, response.data],
    }));
  }, []);

  // Update WorkSpace
  const handleUpdateWorkSpace = useCallback(
    async (data: { _id: string; name: string; members: Employee[] }) => {
      const slug = generateSlug(data.name);
      const dataWithSlug = { ...data, slug };

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          return workspace._id === data._id
            ? { ...workspace, ...dataWithSlug }
            : workspace;
        });

        return {
          ...prev,
          WorkSpaces: updatedWorkSpaces,
        };
      });

      await WorkSpaceApi.updateWorkSpace(data._id, {
        name: data.name,
        slug,
        members: data.members,
      });
    },
    []
  );

  // Delete WorkSpace
  const handleDeleteWorkSpace = useCallback(
    async (_id: string) => {
      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.filter(
          (workspace) => workspace._id !== _id
        ),
      }));

      const { workspace_slug } = router.query;

      if (workspace_slug) {
        router.push(paths.index);
      }

      await WorkSpaceApi.deleteWorkSpace(_id);
    },
    [router]
  );

  // Add Board
  const handleAddBoard = useCallback(async (data: any) => {
    const slug = generateSlug(data.name);
    const dataWithSlug = { ...data, slug };
    const response = await BoardsApi.addBoard(dataWithSlug);

    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) =>
        workspace._id === data.workspace
          ? { ...workspace, boards: [...workspace.boards, response.data] }
          : workspace
      );
      return { ...prev, WorkSpaces: updatedWorkSpaces };
    });
  }, []);

  // Update Board
  const handleUpdateBoard = useCallback(
    async (board_id: string, data: Board) => {
      const slug = generateSlug(data.name);
      const dataWithSlug = { ...data, slug };

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) =>
            board._id === board_id ? { ...board, ...dataWithSlug } : board
          ),
        })),
      }));

      await BoardsApi.updateBoard(board_id, dataWithSlug);
    },
    []
  );

  // Get current Board
  const getCurrentBoard = useCallback(
    (
      workspace_slug: string | string[] | undefined,
      board_slug: string | string[] | undefined
    ) => {
      const workspace = state.WorkSpaces.find(
        (item) => item.slug === workspace_slug
      );
      if (!workspace) return undefined;

      const board = workspace.boards.find((board) => board.slug === board_slug);
      if (!board) return undefined;

      return {
        ...board,
        members: [board.owner, ...board.members],
        workspace: {
          _id: workspace._id,
          name: workspace.name,
          slug: workspace.slug,
        },
      };
    },
    [state.WorkSpaces]
  );

  // Delete Board
  const handleDeletBoard = useCallback(async (board_id: string) => {
    await BoardsApi.deleteBoard(board_id);

    setState((prev) => ({
      ...prev,
      WorkSpaces: prev.WorkSpaces.map((workspace) => ({
        ...workspace,
        boards: workspace.boards.filter((board) => board._id !== board_id),
      })),
    }));
  }, []);

  // Add Column
  const handleAddColumn = useCallback(
    async (data: { name: string; board: string }) => {
      const response = await ColumnApi.addColumn(data);

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) =>
            board._id === data.board
              ? { ...board, columns: [...board.columns, response.data] }
              : board
          ),
        })),
      }));
    },
    []
  );

  // Update Column
  const handleUpdateColumn = useCallback(
    async (column_id: string, data: { name: string }) => {
      const response = await ColumnApi.updateColumn(column_id, data);

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) => ({
            ...board,
            columns: board.columns.map((column) =>
              column._id === column_id ? response.data : column
            ),
          })),
        })),
      }));
    },
    []
  );

  // Delete Column
  const handleDeleteColumn = useCallback(async (column_id: string) => {
    await ColumnApi.clearAnddeleteColumn(column_id, "delete");

    setState((prev) => ({
      ...prev,
      WorkSpaces: prev.WorkSpaces.map((workspace) => ({
        ...workspace,
        boards: workspace.boards.map((board) => ({
          ...board,
          columns: board.columns.filter((column) => column._id !== column_id),
        })),
      })),
    }));
  }, []);

  // Clear Column
  const handleClearColumn = useCallback(async (column_id: string) => {
    await ColumnApi.clearAnddeleteColumn(column_id, "clear");

    setState((prev) => ({
      ...prev,
      WorkSpaces: prev.WorkSpaces.map((workspace) => ({
        ...workspace,
        boards: workspace.boards.map((board) => ({
          ...board,
          columns: board.columns.map((column) =>
            column._id === column_id ? { ...column, tasks: [] } : column
          ),
        })),
      })),
    }));
  }, []);

  // Move Column
  const handleMoveColumn = useCallback(
    async (data: { board_id: string; column_id: string; index: number }) => {
      await ColumnApi.moveColumn(data);

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) => {
            if (board._id === data.board_id) {
              const columns = [...board.columns];
              const columnIndex = columns.findIndex(
                (column) => column._id === data.column_id
              );

              if (columnIndex !== -1) {
                const [movedColumn] = columns.splice(columnIndex, 1);
                columns.splice(data.index, 0, movedColumn);
              }

              return { ...board, columns };
            }

            return board;
          }),
        })),
      }));
    },
    []
  );

  // Add Task
  const handleAddTask = useCallback(
    async (data: any) => {
      const response = await TaskApi.addTask(data);

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) => ({
            ...board,
            columns: board.columns.map((column) =>
              column._id === data.column
                ? { ...column, tasks: [...column.tasks, response.data] }
                : column
            ),
          })),
        })),
      }));

      await dispatch(
        thunks.createEvent({ eventType: "task", values: response.data })
      );
    },
    [dispatch]
  );

  // Update Task
  const handleUpdateTask = useCallback(
    async (data: { _id: string; board_id: string; column_id: string }) => {
      const { _id: task_id, ...restValues } = data;

      const { workspace_slug, boards_slug } = router.query;
      const target_link = `/workspaces/${workspace_slug}/boards/${boards_slug}`;

      const response = await TaskApi.updateTask(task_id, {
        ...restValues,
        target_link,
      });

      setState((prev) => ({
        ...prev,
        WorkSpaces: prev.WorkSpaces.map((workspace) => ({
          ...workspace,
          boards: workspace.boards.map((board) => ({
            ...board,
            columns: board.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) =>
                task._id === task_id ? response : task
              ),
            })),
          })),
        })),
      }));
    },
    [router.query]
  );

  // Delete Task
  const handleDeleteTask = useCallback(async (task_id: string) => {
    await TaskApi.deleteTask(task_id);

    setState((prev) => ({
      ...prev,
      WorkSpaces: prev.WorkSpaces.map((workspace) => ({
        ...workspace,
        boards: workspace.boards.map((board) => ({
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task._id !== task_id),
          })),
        })),
      })),
    }));
  }, []);

  const handleMoveTask = useCallback(
    async (data: { task_id: string; index: number; column_id?: string }) => {
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            const columns = [...board.columns];

            // Find the current column containing the task
            let movedTask;
            const currentColumn = columns.find((column) =>
              column.tasks.some((task) => task._id === data.task_id)
            );

            // Remove the task from the current column and save the task object
            if (currentColumn) {
              const taskIndex = currentColumn.tasks.findIndex(
                (task) => task._id === data.task_id
              );
              [movedTask] = currentColumn.tasks.splice(taskIndex, 1);
            }

            // If column_id is provided, move the task to the new column
            if (data.column_id && movedTask) {
              const targetColumn = columns.find(
                (column) => column._id === data.column_id
              );
              if (targetColumn) {
                targetColumn.tasks.splice(data.index, 0, movedTask);
              }
            } else if (currentColumn && movedTask) {
              // Move task within the same column
              currentColumn.tasks.splice(data.index, 0, movedTask);
            }

            return {
              ...board,
              columns,
            };
          });

          return {
            ...workspace,
            boards: updatedBoards,
          };
        });

        return {
          ...prev,
          WorkSpaces: updatedWorkSpaces,
        };
      });

      const { workspace_slug, boards_slug } = router.query;

      const target_link = `/workspaces/${workspace_slug}/boards/${boards_slug}`;

      await TaskApi.moveTask({ ...data, target_link });
    },
    [router.query]
  );

  const getAllTasksForUser = useCallback(
    (userId: string, filter: string) => {
      // Collect tasks assigned to the user
      const fetchedTasks = state.WorkSpaces.flatMap((workspace: any) =>
        workspace.boards.flatMap((board: any) =>
          board.columns.flatMap((column: any) =>
            column.tasks
              .filter(
                (task: any) =>
                  task.owner._id === userId ||
                  task.assignedTo.some(
                    (assignee: any) => assignee._id === userId
                  )
              )
              .map((task: any) => ({
                ...task,
                columnName: column.name,
                boardMembers: board.members,
              }))
          )
        )
      );

      // Sort tasks after collecting them
      const sortedTasks = fetchedTasks.sort((a, b) => {
        switch (filter) {
          case "createdAt":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ); // Most recent first
          case "dueDate":
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            ); // Earliest due date first
          case "priority":
            const priorityOrder: any = { high: 1, moderate: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority]; // Priority order
          default:
            return 0;
        }
      });

      return sortedTasks;
    },
    [state.WorkSpaces]
  );

  const getBoardMembersByTaskId = useCallback(
    (taskId: string) => {
      // Find the workspace containing the board with the task
      for (const workspace of state.WorkSpaces) {
        for (const board of workspace.boards) {
          // Check each column of the board to find the task
          for (const column of board.columns) {
            if (column.tasks.some((task) => task._id === taskId)) {
              // Task found, return the board members
              return [board.owner, ...board.members];
            }
          }
        }
      }
      return [];
    },
    [state.WorkSpaces]
  );

  const getWorkSpaceOptions = useCallback(
    (userId: string, userRole: string) => {
      return state.WorkSpaces.filter((workspace: any) => {
        // If the user is an admin, return all workspaces
        if (userRole === "admin") {
          return true;
        }
        // Otherwise, filter by owner or membership
        return (
          workspace.owner!._id === userId ||
          workspace.members.some((member: any) => member._id === userId)
        );
      }).map((workspace) => ({
        _id: workspace._id,
        name: workspace.name,
      }));
    },
    [state.WorkSpaces]
  );

  const getBoardOptions = useCallback(
    (workSpaceId: string) => {
      const workSpace = state.WorkSpaces.find((ws) => ws._id === workSpaceId);

      if (!workSpace || !workSpace.boards) {
        return [];
      }

      const boardOptions = workSpace.boards.map((board) => ({
        name: board.name,
        _id: board._id,
        columns: board.columns.map((column) => column._id.toString()), // Convert column _id to string
      }));

      return boardOptions;
    },

    [state.WorkSpaces]
  );

  const accessToken = window.localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      handleGetWorkSpaces();
    }
  }, [accessToken, handleGetWorkSpaces]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;
    socket.on("task created", handleGetWorkSpaces);
    socket.on("task updated", handleGetWorkSpaces);
    socket.on("task moved", handleGetWorkSpaces);
    socket.on("task deleted", handleGetWorkSpaces);
    socket.on("column created", handleGetWorkSpaces);
    socket.on("column updated", handleGetWorkSpaces);
    socket.on("column moved", handleGetWorkSpaces);
    socket.on("column cleared | deleted", handleGetWorkSpaces);
    socket.on("board created", handleGetWorkSpaces);
    socket.on("board updated", handleGetWorkSpaces);
    socket.on("workSpace created", handleGetWorkSpaces);
    socket.on("workSpace updated", handleGetWorkSpaces);
    socket.on("board deleted", () => {
      handleGetWorkSpaces();
      const { workspace_slug } = router.query;
      const { boards_slug } = router.query;
      if (boards_slug) {
        router.push(`${paths.workspaces}/${workspace_slug}`);
      }
    });
    socket.on("workSpace deleted", () => {
      handleGetWorkSpaces();
      const { workspace_slug } = router.query;
      if (workspace_slug) {
        router.push(paths.workspaces);
      }
    });

    return () => {
      socket.off("task created");
      socket.off("task updated");
      socket.off("task moved");
      socket.off("task deleted");
      socket.off("column created");
      socket.off("column updated");
      socket.off("column moved");
      socket.off("column cleared | deleted");
      socket.off("board created");
      socket.off("board updated");
      socket.off("workSpace created");
      socket.off("workSpace updated");
      socket.off("board deleted");
      socket.off("workSpace deleted");
    };
  }, [socket, handleGetWorkSpaces, router]);

  return (
    <WorkSpaceContext.Provider
      value={{
        ...state,
        isLoading,
        getCurrentWorkSpace,
        handleAddWorkSpace,
        handleUpdateWorkSpace,
        getAllTasksForUser,
        getBoardMembersByTaskId,
        handleDeleteWorkSpace,
        getCurrentBoard,
        handleAddBoard,
        handleUpdateBoard,
        handleDeletBoard,
        handleAddColumn,
        handleUpdateColumn,
        handleDeleteColumn,
        handleClearColumn,
        handleMoveColumn,
        handleAddTask,
        handleDeleteTask,
        handleMoveTask,
        handleUpdateTask,
        getWorkSpaceOptions,
        getBoardOptions,
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

WorkSpaceProvider.propTypes = {
  children: PropTypes.node,
};
