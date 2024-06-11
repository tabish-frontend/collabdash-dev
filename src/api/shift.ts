import Axios from "src/config/axios";
import { Shift } from "src/types";

class ShiftAPI {
  //   async getAllUserHolidays() {
  //     const response = await Axios.get(`/holidays`)

  //     return response.data
  //   }

  async addShift(body: Shift) {
    const response = await Axios.post(`/shifts`, body);

    return response;
  }

  async updateShift(shift_id: string, body: Shift) {
    const response = await Axios.patch(`/shifts/${shift_id}`, body);

    return response;
  }

  //   async deleteHoliday(holiday_id: string) {
  //     const response = await Axios.delete(`/holidays/${holiday_id}`)

  //     return response.data
  //   }

  //   async getMyHolidays(params: any) {
  //     const response = await Axios.get(`/users/getMyAllHolidays?year=${params.year}`)

  //     return response.data
  //   }
}

export const shiftApi = new ShiftAPI();
