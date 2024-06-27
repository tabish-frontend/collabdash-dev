import axios from "axios";
import Axios from "src/config/axios";

class AttendanceApi {
  async manageAttendance(action: string) {
    const response = await Axios.post(`/attendance/${action}`);

    return response;
  }

  async getTodayAttendance() {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/myTodayAttendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getAllUserAttendance(query: any) {
    const response = await Axios.get(
      `/attendance?view=${query.view}&month=${query.month}&year=${query.year}&date=${query.date}`
    );

    return response;
  }

  async getMyAttendance(query: any) {
    const response = await Axios.get(
      `/users/getMyallAttendance?view=${query.view}&month=${query.month}&year=${query.year}&date=${query.date}`
    );

    return response;
  }
}

export const attendanceApi = new AttendanceApi();
