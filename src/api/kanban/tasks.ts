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

  //   async updateColumn(column_id: string, body: { name: String }) {
  //     const response = await Axios.patch(`/column/${column_id}`, body);
  //     return response;
  //   }

  //   async moveColumn(
  //     board_id: string,
  //     body: { column_id: string; index: number }
  //   ) {
  //     const response = await Axios.patch(`/column/move/${board_id}`, body);
  //     return response.data;
  //   }
}

export const TaskApi = new TaskAPI();
