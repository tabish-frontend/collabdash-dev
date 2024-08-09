import Axios from "src/config/axios";
import { WorkSpaceBoardColumn } from "src/types";

class ColumnAPI {
  async addColumn(body: { name: string; board: string }) {
    const response = await Axios.post(`/column`, body);
    return response;
  }

  async updateColumn(column_id: string, body: { name: String }) {
    const response = await Axios.patch(`/column/${column_id}`, body);
    return response;
  }

  async clearAnddeleteColumn(column_id: string, type: string) {
    const response = await Axios.delete(`/column/${column_id}?type=${type}`);
    return response.data;
  }

  async moveColumn(body: {
    board_id: string;
    column_id: string;
    index: number;
  }) {
    const response = await Axios.post(`/column/move`, body);
    return response.data;
  }
}

export const ColumnApi = new ColumnAPI();
