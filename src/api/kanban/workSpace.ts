import Axios from "src/config/axios";
import { Employee, WorkSpace } from "src/types";

class WorkSpaceAPI {
  async addWorkSpace(body: WorkSpace) {
    const response = await Axios.post(`/workspace`, body);
    return response;
  }

  async getAllWorkSpaces() {
    const response = await Axios.get(`/workspace`);
    return response;
  }

  async updateWorkSpace(
    workspace_id: string,
    body: { name: string; slug: string; members: Employee[] }
  ) {
    const response = await Axios.patch(`/workspace/${workspace_id}`, body);
    return response.data;
  }

  async deleteWorkSpace(_id: string) {
    const response = await Axios.delete(`/workspace/${_id}`);
    return response.data;
  }
}

export const WorkSpaceApi = new WorkSpaceAPI();
