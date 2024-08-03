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
  handleUpdateWorkSpace: (settings: WorkSpace) => void;
  handleOpen: (_id?: string) => void;
  handleClose: () => void;
  handleAddWorkSpace: (data: WorkSpace) => void;
  getCurrentWorkSpace: (slug: string | string[] | undefined) => any;
  handleAddBoard: (data: WorkSpaceBoard) => void;
}

export const WorkSpaceContext = createContext<WorkSpaceContextType>({
  ...initialState,
  handleUpdateWorkSpace: () => {},
  handleOpen: () => {},
  handleClose: () => {},
  handleAddWorkSpace: () => {},
  getCurrentWorkSpace: (slug) => initialState.WorkSpaces,
  handleAddBoard: () => {},
});
