import Axios from "src/config/axios";
import { Leaves } from "src/types";

class LeavesAPI {
  async getAllUserLeaves(params: any) {
    const response = await Axios.get(
      `/leaves?month=${params.month}&year=${params.year}`
    );
    return response.data;
  }

  async getMyLeaves(params: any) {
    const response = await Axios.get(
      `/users/getMyLeaves?month=${params.month}&year=${params.year}`
    );

    return response.data;
  }

  async addLeave(body: Leaves) {
    const response = await Axios.post(`/leaves`, body);

    return response;
  }

  async updateLeave(leave_id: string, body: Leaves) {
    const response = await Axios.patch(`/leaves/${leave_id}`, body);

    return response.data;
  }

  async deleteLeave(leave_id: string) {
    const response = await Axios.delete(`/leaves/${leave_id}`);

    return response.data;
  }

  async apllyForLeave(body: Leaves) {
    const response = await Axios.post(`/users/leaveApply`, body);

    return response.data;
  }

  async updateLeaveStatus(params: any) {
    const response = await Axios.put(
      `/leaves/${params.leave_id}/status/${params.status}`
    );

    return response.data;
  }
}

export const leavesApi = new LeavesAPI();
