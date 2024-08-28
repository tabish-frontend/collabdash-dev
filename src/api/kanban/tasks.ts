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

  async updateTask(task_id: string, body: any) {
    const response = await Axios.patch(`/task/${task_id}`, body);
    return response.data;
  }
  async submitAttachment(body: any) {
    const response = await Axios.post(`/task/attachment`, body);
    return response.data;
  }

  async deleteAttachment(id: string | undefined) {
    const response = await Axios.delete(`/task/attachment/${id}`);
    return response.data;
  }
}

export const TaskApi = new TaskAPI();
