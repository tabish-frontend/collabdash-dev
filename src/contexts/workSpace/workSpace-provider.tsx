import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import type { State } from "./workSpace-context";
import { WorkSpaceContext, initialState } from "./workSpace-context";
import { WorkSpace, WorkSpaceBoard } from "src/types";
import { WorkSpaceApi } from "src/api/kanban/workSpace";
import { BoardsApi } from "src/api/kanban/boards";
import { ColumnApi } from "src/api/kanban/column";
import { TaskApi } from "src/api/kanban/tasks";

interface WorkSpaceProviderProps {
  children?: ReactNode;
}

export const WorkSpaceProvider: FC<WorkSpaceProviderProps> = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);

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

  const handleUpdateWorkSpace = useCallback((data: WorkSpace): void => {
    // setState((prevState) => {
    //   // storeSettings({
    //   //   colorPreset: prevState.colorPreset,
    //   //   layout: prevState.layout,
    //   //   navColor: prevState.navColor,
    //   //   paletteMode: prevState.paletteMode,
    //   //   responsiveFontSizes: prevState.responsiveFontSizes,
    //   //   stretch: prevState.stretch,
    //   //   ...settings,
    //   // });
    //   return {
    //     ...prevState,
    //     ...data,
    //   };
    // });
    // setState((prevState) => ({
    //   ...data,
    //   openModal: false,
    // }));
  }, []);

  const handleAddBoard = useCallback(async (data: WorkSpaceBoard) => {
    const response = await BoardsApi.addBoard(data);

    console.log("response", response);
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
      return workspace.boards.find((board) => board.slug === board_slug);
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
    await ColumnApi.deleteColumn(column_id);

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

  const handleMoveColumn = useCallback(
    async (data: { board_id: string; column_id: string; index: number }) => {
      const { board_id, ...resValues } = data;

      setState((prev) => {
        const updatedWorkSpaces = prev.WorkSpaces.map((workspace) => {
          const updatedBoards = workspace.boards.map((board) => {
            if (board._id === board_id) {
              const columns = [...board.columns];
              const columnIndex = columns.findIndex(
                (column) => column._id === resValues.column_id
              );

              if (columnIndex !== -1) {
                const [movedColumn] = columns.splice(columnIndex, 1);
                columns.splice(resValues.index, 0, movedColumn);
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

      await ColumnApi.moveColumn(board_id, resValues);
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

  const handleOpen = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      openModal: true,
    }));
  }, []);

  const handleClose = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      openModal: false,
    }));
  }, []);

  useEffect(() => {
    handleGetWorkSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WorkSpaceContext.Provider
      value={{
        ...state,
        handleOpen,
        handleClose,
        getCurrentWorkSpace,
        handleAddWorkSpace,
        handleUpdateWorkSpace,
        getCurrentBoard,
        handleAddBoard,
        handleUpdateBoard,
        handleDeletBoard,
        handleAddColumn,
        handleUpdateColumn,
        handleDeleteColumn,
        handleMoveColumn,
        handleAddTask,
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

WorkSpaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
