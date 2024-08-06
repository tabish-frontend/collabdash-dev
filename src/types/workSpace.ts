import { Employee } from "./employee";
import { Board } from "./kanban";

export interface WorkSpaceBoardColumnTasks {
  _id: string;
  title: string;
  description?: string;
  board: Board;
  column: WorkSpaceBoardColumn;
  assignedTo: Employee[];
  owner: Employee;
  attachments: string[];
}

export interface WorkSpaceBoardColumn {
  _id: string;
  name: string;
  owner?: Employee;
  board: WorkSpaceBoard;
  tasks: [];
}

export interface WorkSpaceBoard {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  workspace: string;
  owner: string;
  members: Employee[];
  columns: WorkSpaceBoardColumn[];
  tasks: [];
}

export interface WorkSpace {
  _id: string;
  name?: string;
  slug?: string;
  owner?: string;
  members: Employee[];
  boards: WorkSpaceBoard[];
}
