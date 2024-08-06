import Axios from "src/config/axios";
import { WorkSpaceBoardColumn } from "src/types";

class columnAPI {
  async addColumn(body: { name: string; board: string }) {
    const response = await Axios.post(`/column`, body);
    return response;
  }

  async updateColumn(column_id: string, body: { name: String }) {
    const response = await Axios.patch(`/column/${column_id}`, body);
    return response;
  }

  async deleteColumn(column_id: string) {
    const response = await Axios.delete(`/column/${column_id}`);
    return response.data;
  }

  async moveColumn(
    board_id: string,
    body: { column_id: string; index: number }
  ) {
    const response = await Axios.patch(`/column/move/${board_id}`, body);
    return response.data;
  }
}

export const ColumnApi = new columnAPI();
