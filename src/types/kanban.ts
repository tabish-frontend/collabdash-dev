import { Employee } from "./employee";

export interface Attachment {
  _id: string;
  name: string;
  type: string;
  url: string;
}
export interface Tasks {
  _id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: string;
  board: Board;
  column: string;
  assignedTo: Employee[];
  owner: Employee;
  attachments: Attachment[];
}

export interface Column {
  _id: string;
  name: string;
  owner?: Employee;
  board: Board;
  tasks: Tasks[];
}

export interface Board {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  workspace: string;
  owner: string;
  members: Employee[];
  columns: Column[];
  tasks: [];
}

export interface WorkSpace {
  _id: string;
  name: string;
  slug?: string;
  owner?: string;
  members: Employee[];
  boards: Board[];
}
