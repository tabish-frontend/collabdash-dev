import { createContext } from "react";
import { workSpaceInitialValues } from "src/formik";
import { WorkSpace, WorkSpaceBoard } from "src/types";

export interface State {
  openModal: boolean;
  WorkSpaces: WorkSpace[];
  currentWorkspace: WorkSpace;
}

export const initialState: State = {
  WorkSpaces: [],
  openModal: false,
  currentWorkspace: workSpaceInitialValues,
};

export interface WorkSpaceContextType extends State {
  // handleOpen: (type: "create" | "update", slug?: string) => void;
  handleOpen: (slug?: string) => void;
  handleClose: () => void;
  getCurrentWorkSpace: (slug: string | string[] | undefined) => any;
  handleAddWorkSpace: (data: WorkSpace) => void;
  handleUpdateWorkSpace: (settings: WorkSpace) => void;
  getCurrentBoard: (
    workspace_slug: string | string[] | undefined,
    board_slug: string | string[] | undefined
  ) => any;
  handleAddBoard: (data: WorkSpaceBoard) => void;
  handleUpdateBoard: (board_id: string, data: WorkSpaceBoard) => void;
  handleDeletBoard: (board_id: string) => void;
  handleAddColumn: (data: { name: string; board: string }) => void;
  handleUpdateColumn: (column_id: string, data: { name: string }) => void;
  handleDeleteColumn: (column_id: string) => void;
  handleMoveColumn: (data: {
    board_id: string;
    column_id: string;
    index: number;
  }) => void;
  handleAddTask: (data: {
    title: string;
    board: string;
    column: string;
  }) => void;
}

export const WorkSpaceContext = createContext<WorkSpaceContextType>({
  ...initialState,
  handleOpen: () => {},
  handleClose: () => {},
  getCurrentWorkSpace: (slug) => initialState.WorkSpaces,
  handleUpdateWorkSpace: () => {},
  handleAddWorkSpace: () => {},
  getCurrentBoard: () => {},
  handleAddBoard: () => {},
  handleUpdateBoard: () => {},
  handleDeletBoard: () => {},
  handleAddColumn: () => {},
  handleUpdateColumn: () => {},
  handleDeleteColumn: () => {},
  handleMoveColumn: () => {},
  handleAddTask: () => {},
});
