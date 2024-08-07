import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import type { State } from "./workSpace-context";
import { WorkSpaceContext, initialState } from "./workSpace-context";
import { WorkSpace, WorkSpaceBoard } from "src/types";
import { WorkSpaceApi } from "src/api/kanban/workSpace";
import { BoardsApi } from "src/api/kanban/boards";
import { workSpaceInitialValues } from "src/formik";

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

  const getCurrentWorkSpace = (slug: string | string[] | undefined) => {
    return state.WorkSpaces.find((item) => item.slug === slug);
  };

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

  const handleOpen = useCallback(
    (slug: string | undefined): void => {
      if (slug) {
        const current = getCurrentWorkSpace(slug);
        if (current) {
          setState((prev) => ({
            ...prev,
            openModal: true,
            currentWorkspace: current,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          openModal: true,
          currentWorkspace: workSpaceInitialValues,
        }));
      }
    },
    [getCurrentWorkSpace]
  );

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
        handleAddBoard,
        handleUpdateBoard,
        handleDeletBoard,
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

WorkSpaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
