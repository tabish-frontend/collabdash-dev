import { createContext } from "react";
import { WorkSpace, WorkSpaceBoard } from "src/types";

export interface State {
  openModal: boolean;
  WorkSpaces: WorkSpace[];
}

export const initialState: State = {
  WorkSpaces: [],
  openModal: false,
};

export interface WorkSpaceContextType extends State {
  handleOpen: (data?: any) => void;
  handleClose: () => void;
  getCurrentWorkSpace: (slug: string | string[] | undefined) => any;
  handleAddWorkSpace: (data: WorkSpace) => void;
  handleUpdateWorkSpace: (settings: WorkSpace) => void;
  handleAddBoard: (data: WorkSpaceBoard) => void;
  handleUpdateBoard: (board_id: string, data: WorkSpaceBoard) => void;
  handleDeletBoard: (board_id: string) => void;
}

export const WorkSpaceContext = createContext<WorkSpaceContextType>({
  ...initialState,
  handleOpen: () => {},
  handleClose: () => {},
  getCurrentWorkSpace: (slug) => initialState.WorkSpaces,
  handleUpdateWorkSpace: () => {},
  handleAddWorkSpace: () => {},
  handleAddBoard: () => {},
  handleUpdateBoard: () => {},
  handleDeletBoard: () => {},
});
