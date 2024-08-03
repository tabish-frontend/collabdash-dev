import { Employee } from "./employee";

export interface WorkSpaceBoard {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  workspace: string;
  owner: string;
  members: Employee[];
  columns: [];
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
