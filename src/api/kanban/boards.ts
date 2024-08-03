import Axios from "src/config/axios";
import { WorkSpaceBoard } from "src/types";

class BoardsAPI {
  async addBoard(body: WorkSpaceBoard) {
    const response = await Axios.post(`/boards`, body);
    return response;
  }
}

export const BoardsApi = new BoardsAPI();
