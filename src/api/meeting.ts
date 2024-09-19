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
  //   async getMyHolidays(Year: any) {
  //     const response = await Axios.get(
  //       `/users/getMyAllHolidays?year=${Year}`
  //     );
  //     return response.data;
  //   }
  //   async updateHoliday(holiday_id: string, body: Holiday) {
  //     const response = await Axios.patch(`/holidays/${holiday_id}`, body);
  //     return response.data;
  //   }
  //   async deleteHoliday(holiday_id: string) {
  //     const response = await Axios.delete(`/holidays/${holiday_id}`);
  //     return response.data;
  //   }
}

export const meetingApi = new MeetingAPI();
