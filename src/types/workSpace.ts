import { Employee } from "./employee";
import { Board } from "./kanban";

export interface TaskAttachment {
  _id: string;
  name: string;
  type: string;
  url: string;
}
export interface WorkSpaceBoardColumnTasks {
  _id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: string;
  board: Board;
  column: string;
  assignedTo: Employee[];
  owner: Employee;
  attachments: TaskAttachment[];
}

export interface WorkSpaceBoardColumn {
  _id: string;
  name: string;
  owner?: Employee;
  board: WorkSpaceBoard;
  tasks: WorkSpaceBoardColumnTasks[];
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
  name: string;
  slug?: string;
  owner?: string;
  members: Employee[];
  boards: WorkSpaceBoard[];
}
