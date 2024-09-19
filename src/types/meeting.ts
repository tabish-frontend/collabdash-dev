import { Employee } from "./employee";

export interface Meeting {
  _id?: string;
  title: string;
  time: Date | null;
  participants: Employee[];
  owner?: Employee;
}
