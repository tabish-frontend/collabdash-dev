import Axios from "src/config/axios";
import { WorkSpaceBoard } from "src/types";

class BoardsAPI {
  async addBoard(body: WorkSpaceBoard) {
    const response = await Axios.post(`/boards`, body);
    return response;
  }

  async updateBoard(board_id: string, body: WorkSpaceBoard) {
    const response = await Axios.patch(`/boards/${board_id}`, body);
    return response.data;
  }

  async deleteBoard(board_id: string) {
    const response = await Axios.delete(`/boards/${board_id}`);
    return response.data;
  }
}

export const BoardsApi = new BoardsAPI();
