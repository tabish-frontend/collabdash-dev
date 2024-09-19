import Axios from "src/config/axios";
import { Meeting } from "src/types";

class MeetingAPI {
  async createMeeting(body: Meeting) {
    const response = await Axios.post(`/meetings`, body);
    return response;
  }

  async getAllMeetings(status: string) {
    const response = await Axios.get(`/meetings?status=${status}`);
    return response;
  }
  async getMeeting(id: string) {
    const response = await Axios.get(`/meetings/${id}`);
    return response;
  }

  async updateMeeting(id: string, body: Meeting) {
    const response = await Axios.patch(`/meetings/${id}`, body);
    return response;
  }

  async deleteMeeting(id: string) {
    const response = await Axios.delete(`/meetings/${id}`);
    return response;
  }
}

export const meetingApi = new MeetingAPI();
