import Axios from "src/config/axios";
import { WorkSpace } from "src/types";

class WorkSpaceAPI {
  async addWorkSpace(body: WorkSpace) {
    const response = await Axios.post(`/workspace`, body);
    return response;
  }

  async getAllWorkSpaces() {
    const response = await Axios.get(`/workspace`);
    return response;
  }
}

export const WorkSpaceApi = new WorkSpaceAPI();
