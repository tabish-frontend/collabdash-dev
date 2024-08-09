import Axios from "src/config/axios";
import { WorkSpaceBoardColumn } from "src/types";

class TaskAPI {
  async addTask(body: { title: string; board: string; column: string }) {
    const response = await Axios.post(`/task`, body);
    return response;
  }

  async deleteTask(task_id: string) {
    const response = await Axios.delete(`/task/${task_id}`);
    return response.data;
  }

  async moveTask(body: { task_id: string; index: number; column_id?: string }) {
    const response = await Axios.post(`/task/move`, body);
    return response.data;
  }
}

export const TaskApi = new TaskAPI();
