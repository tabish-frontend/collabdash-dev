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

interface WorkSpaceProviderProps {
  children?: ReactNode;
}

export const WorkSpaceProvider: FC<WorkSpaceProviderProps> = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleGetWorkSpaces = useCallback(async () => {
    setIsLoading(true);
    const response = await WorkSpaceApi.getAllWorkSpaces();

    setState((prev) => ({
      ...prev,
      WorkSpaces: response.data,
    }));
    setIsLoading(false);
  }, []);

  const getCurrentWorkSpace = useCallback(
    (slug: string | string[] | undefined) => {
      return state.WorkSpaces.find((item) => item.slug === slug);
    },
    [state.WorkSpaces]
  );

  const handleAddWorkSpace = useCallback(async (data: WorkSpace) => {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/\//g, "-"); // Replace "/" with "-"

    const datawithslug = { ...data, slug };

    const response = await WorkSpaceApi.addWorkSpace(datawithslug);

    setState((prev) => ({
      ...prev,
      openModal: false,
      WorkSpaces: [...prev.WorkSpaces, response.data],
    }));
  }, []);

  const handleUpdateWorkSpace = useCallback(
    async (data: { _id: string; name: string; members: Employee[] }) => {
      const { _id, name, members } = data;

      const slug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/\//g, "-"); // Replace "/" with "-"

      const datawithslug = { ...data, slug };

      // Update the state with the new data before making the API call
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          return workspace._id === _id
            ? { ...workspace, ...datawithslug }
            : workspace;
        });

        return {
          ...prev,
          WorkSpaces: updatedWorkSpaces,
        };
      });

      // Make the API call
      await WorkSpaceApi.updateWorkSpace(_id, {
        name,
        slug,
        members,
      });
    },
    []
  );

  const handleDeleteWorkSpace = useCallback(
    async (_id: string) => {
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.filter(
          (workspace) => workspace._id !== _id
        );

        return {
          ...prev,
          WorkSpaces: updatedWorkSpaces,
        };
      });

      const { workspace_slug } = router.query;

      if (workspace_slug) {
        router.push(paths.index);
      }

      await WorkSpaceApi.deleteWorkSpace(_id);
    },
    [router]
  );

  const handleAddBoard = useCallback(async (data: any) => {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/\//g, "-"); // Replace "/" with "-"

    const datawithslug = { ...data, slug };

    const response = await BoardsApi.addBoard(datawithslug);

    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
        if (workspace._id === data.workspace) {
          return {
            ...workspace,
            boards: [...workspace.boards, response.data],
          };
        }
        return workspace;
      });
      return {
        ...prev,
        WorkSpaces: updatedWorkSpaces,
      };
    });
  }, []);

  const handleUpdateBoard = useCallback(
    async (board_id: string, data: Board) => {
      const slug = data.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/\//g, "-"); // Replace "/" with "-"

      const datawithslug = { ...data, slug };

      // Update the state with the new data before making the API call
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) =>
            board._id === board_id ? { ...board, ...datawithslug } : board
          );
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

      // Make the API call
      await BoardsApi.updateBoard(board_id, datawithslug);
    },
    []
  );

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
        workspace: {
          _id: workspace._id,
          name: workspace.name,
          slug: workspace.slug,
        },
      };
    },
    [state.WorkSpaces]
  );

  const handleDeletBoard = useCallback(async (board_id: string) => {
    await BoardsApi.deleteBoard(board_id);

    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
        const updatedBoards = workspace.boards.filter(
          (board) => board._id !== board_id
        );
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
  }, []);

  const handleAddColumn = useCallback(
    async (data: { name: string; board: string }) => {
      const response = await ColumnApi.addColumn(data);

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            if (board._id === data.board) {
              return {
                ...board,

                columns: [...board.columns, response.data],
              };
            }
            return board;
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
    },
    []
  );

  const handleUpdateColumn = useCallback(
    async (column_id: string, data: { name: string }) => {
      const response = await ColumnApi.updateColumn(column_id, data);

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            const updatedColumns = board.columns.map((column) =>
              column._id === column_id ? response.data : column
            );
            return {
              ...board,
              columns: updatedColumns,
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
    },
    []
  );

  const handleDeleteColumn = useCallback(async (column_id: string) => {
    await ColumnApi.clearAnddeleteColumn(column_id, "delete");

    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
        const updatedBoards = workspace.boards.map((board) => {
          const updatedColumns = board.columns.filter(
            (column) => column._id !== column_id
          );
          return {
            ...board,
            columns: updatedColumns,
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
  }, []);

  const handleClearColumn = useCallback(async (column_id: string) => {
    await ColumnApi.clearAnddeleteColumn(column_id, "clear");

    // Update the state to remove tasks from the column
    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
        const updatedBoards = workspace.boards.map((board) => {
          const updatedColumns = board.columns.map((column) => {
            if (column._id === column_id) {
              return {
                ...column,
                tasks: [],
              };
            }
            return column;
          });

          return {
            ...board,
            columns: updatedColumns,
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
  }, []);

  const handleMoveColumn = useCallback(
    async (data: { board_id: string; column_id: string; index: number }) => {
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            if (board._id === data.board_id) {
              const columns = [...board.columns];
              const columnIndex = columns.findIndex(
                (column) => column._id === data.column_id
              );

              if (columnIndex !== -1) {
                const [movedColumn] = columns.splice(columnIndex, 1);
                columns.splice(data.index, 0, movedColumn);
              }

              return {
                ...board,
                columns,
              };
            }

            return board;
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

      await ColumnApi.moveColumn(data);
    },
    []
  );

  const handleAddTask = useCallback(
    async (data: { title: string; board: string; column: string }) => {
      const response = await TaskApi.addTask(data);
      const newTask = response.data;

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            if (board._id === data.board) {
              const updatedColumns = board.columns.map((column) => {
                if (column._id === data.column) {
                  return {
                    ...column,
                    tasks: [...column.tasks, newTask],
                  };
                }
                return column;
              });

              return {
                ...board,
                columns: updatedColumns,
              };
            }
            return board;
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
    },
    []
  );

  const handleUpdateTask = useCallback(
    async (data: {
      _id: string;
      board_id: string;
      column_id: string;
      [key: string]: any;
    }) => {
      const { _id: task_id, ...restValues } = data;
      const { workspace_slug, boards_slug } = router.query;
      const target_link = `/workspaces/${workspace_slug}/boards/${boards_slug}`;
      const response = await TaskApi.updateTask(task_id, {
        ...restValues,
        target_link,
      });

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            const updatedColumns = board.columns.map((column) => {
              const updatedTasks = column.tasks.map((task) =>
                task._id === task_id ? { ...task, ...response } : task
              );

              return {
                ...column,
                tasks: updatedTasks,
              };
            });

            return {
              ...board,
              columns: updatedColumns,
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
    },
    [router.query]
  );

  const handleDeleteTask = useCallback(async (_id: string) => {
    await TaskApi.deleteTask(_id);

    setState((prev) => {
      const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
        const updatedBoards = workspace.boards.map((board) => {
          const updatedColumns = board.columns.map((column) => {
            const updatedTasks = column.tasks.filter(
              (task) => task._id !== _id
            );

            return {
              ...column,
              tasks: updatedTasks,
            };
          });

          return {
            ...board,
            columns: updatedColumns,
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
              .filter((task: any) =>
                task.assignedTo.some((assignee: any) => assignee._id === userId)
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

  const accessToken = window.localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      handleGetWorkSpaces();
    }
  }, [accessToken, handleGetWorkSpaces]);

  return (
    <WorkSpaceContext.Provider
      value={{
        ...state,
        isLoading,
        getCurrentWorkSpace,
        handleAddWorkSpace,
        handleUpdateWorkSpace,
        getAllTasksForUser,
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
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

WorkSpaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
