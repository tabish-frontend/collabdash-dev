import { createContext } from "react";
import { workSpaceInitialValues } from "src/formik";
import { WorkSpace, Board, Employee } from "src/types";

export interface State {
  WorkSpaces: WorkSpace[];
}

export const initialState: State = {
  WorkSpaces: [],
};

export interface WorkSpaceContextType extends State {
  getCurrentWorkSpace: (slug: string | string[] | undefined) => any;
  handleAddWorkSpace: (data: WorkSpace) => void;
  handleUpdateWorkSpace: (data: {
    _id: string;
    name: string;
    members: Employee[];
  }) => void;
  handleDeleteWorkSpace: (_id: string) => void;
  getCurrentBoard: (
    workspace_slug: string | string[] | undefined,
    board_slug: string | string[] | undefined
  ) => any;
  handleAddBoard: (data: Board) => void;
  handleUpdateBoard: (board_id: string, data: Board) => void;
  handleDeletBoard: (board_id: string) => void;
  handleAddColumn: (data: { name: string; board: string }) => void;
  handleUpdateColumn: (column_id: string, data: { name: string }) => void;
  handleDeleteColumn: (column_id: string) => void;
  handleClearColumn: (column_id: string) => void;
  handleMoveColumn: (data: {
    board_id: string;
    column_id: string;
    index: number;
  }) => void;
  handleAddTask: (data: any) => void;
  handleDeleteTask: (_id: string) => void;
  handleMoveTask: (data: {
    task_id: string;
    index: number;
    column_id?: string;
  }) => void;
  handleUpdateTask: (data: any) => void;
  getAllTasksForUser: (userId: string, filter: string) => any;
  getBoardMembersByTaskId: (taskId: string) => any;
  getWorkSpaceOptions: (userId: string, userRole: string) => any;
  getBoardOptions: (workSpaceId: string) => any;
  isLoading: boolean;
}

export const WorkSpaceContext = createContext<WorkSpaceContextType>({
  ...initialState,
  getCurrentWorkSpace: (slug) => initialState.WorkSpaces,
  handleUpdateWorkSpace: () => {},
  handleDeleteWorkSpace: () => {},
  handleAddWorkSpace: () => {},
  getCurrentBoard: () => {},
  handleAddBoard: () => {},
  handleUpdateBoard: () => {},
  handleDeletBoard: () => {},
  handleAddColumn: () => {},
  handleUpdateColumn: () => {},
  handleDeleteColumn: () => {},
  handleClearColumn: () => {},
  handleMoveColumn: () => {},
  handleAddTask: () => {},
  handleDeleteTask: () => {},
  handleMoveTask: () => {},
  handleUpdateTask: () => {},
  getAllTasksForUser: () => {},
  getBoardMembersByTaskId: () => {},
  getWorkSpaceOptions: () => {},
  getBoardOptions: () => {},
  isLoading: false,
});
