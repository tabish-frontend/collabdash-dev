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

  async getAllUserAttendance(filters: any) {
    const date = new Date(filters.date);
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const year = date.getFullYear();

    let query: any = { view: "month", month: month, year: year, date: null };

    if (filters.view === "day") {
      query = {
        view: "day",
        month: null,
        year: null,
        date: filters.date,
      };
    }

    const response = await Axios.get(
      `/attendance?view=${query.view}&month=${query.month}&year=${query.year}&date=${query.date}`
    );

    return response;
  }

  async getMyAttendance(filters: any) {
    const date = new Date(filters.date);
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const year = date.getFullYear();

    let query: any = { view: "month", month: month, year: year, date: null };

    if (filters.view === "day") {
      query = {
        view: "day",
        month: null,
        year: null,
        date: filters.date,
      };
    }

    const response = await Axios.get(
      `/users/getMyallAttendance?view=${query.view}&month=${query.month}&year=${query.year}&date=${query.date}`
    );

    return response;
  }
}

export const attendanceApi = new AttendanceApi();
