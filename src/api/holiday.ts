import Axios from "src/config/axios";
import { Holiday } from "src/types";

class HolidayAPI {
  async getAllUserHolidays(Year: any) {
    const response = await Axios.get(`/holidays?year=${Year}`);

    return response.data;
  }

  async getMyHolidays(Year: any) {
    const response = await Axios.get(
      `/users/getMyAllHolidays?year=${Year}`
    );

    return response.data;
  }

  async addHoliday(body: Holiday) {
    const response = await Axios.post(`/holidays`, body);

    return response;
  }

  async updateHoliday(holiday_id: string, body: Holiday) {
    const response = await Axios.patch(`/holidays/${holiday_id}`, body);

    return response.data;
  }

  async deleteHoliday(holiday_id: string) {
    const response = await Axios.delete(`/holidays/${holiday_id}`);

    return response.data;
  }
}

export const holidaysApi = new HolidayAPI();
