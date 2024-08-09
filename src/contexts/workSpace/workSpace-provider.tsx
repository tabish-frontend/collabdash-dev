import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import type { State } from "./workSpace-context";
import { WorkSpaceContext, initialState } from "./workSpace-context";
import { WorkSpace, WorkSpaceBoard } from "src/types";
import { WorkSpaceApi } from "src/api/kanban/workSpace";
import { BoardsApi } from "src/api/kanban/boards";
import { workSpaceInitialValues } from "src/formik";
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
  const router = useRouter();

  const handleGetWorkSpaces = useCallback(async () => {
    const response = await WorkSpaceApi.getAllWorkSpaces();

    setState((prev) => ({
      ...prev,
      WorkSpaces: response.data,
    }));
  }, []);

  const getCurrentWorkSpace = useCallback(
    (slug: string | string[] | undefined) => {
      return state.WorkSpaces.find((item) => item.slug === slug);
    },
    [state.WorkSpaces]
  );

  const handleAddWorkSpace = useCallback(async (data: WorkSpace) => {
    const response = await WorkSpaceApi.addWorkSpace(data);

    setState((prev) => ({
      ...prev,
      openModal: false,
      WorkSpaces: [...prev.WorkSpaces, response.data],
    }));
  }, []);

  const handleUpdateWorkSpace = useCallback(
    async (data: { _id: string; name: string; members: string[] }) => {
      const { _id, name, members } = data;

      const response = await WorkSpaceApi.updateWorkSpace(_id, {
        name,
        members,
      });

      // Update the state with the response data
      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          return workspace._id === _id
            ? { ...workspace, ...response }
            : workspace;
        });

        return {
          ...prev,
          WorkSpaces: updatedWorkSpaces,
        };
      });

      const { boards_slug } = router.query;
      const updatedSlug = response.slug;

      if (boards_slug) {
        router.push(`${paths.workspaces}/${updatedSlug}/boards/${boards_slug}`);
      } else {
        router.push(`${paths.workspaces}/${updatedSlug}`);
      }
    },
    [router]
  );

  const handleDeleteWorkSpace = useCallback(
    async (_id: string) => {
      await WorkSpaceApi.deleteWorkSpace(_id);

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
    },
    [router]
  );

  const handleAddBoard = useCallback(async (data: any) => {
    const response = await BoardsApi.addBoard(data);

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
    async (board_id: string, data: WorkSpaceBoard) => {
      const response = await BoardsApi.updateBoard(board_id, data);

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) =>
            board._id === board_id ? response : board
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

      await TaskApi.moveTask(data);
    },
    []
  );

  useEffect(() => {
    handleGetWorkSpaces();
  }, [handleGetWorkSpaces]);

  return (
    <WorkSpaceContext.Provider
      value={{
        ...state,
        getCurrentWorkSpace,
        handleAddWorkSpace,
        handleUpdateWorkSpace,
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
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

WorkSpaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
