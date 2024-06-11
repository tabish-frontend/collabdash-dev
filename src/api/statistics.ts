import Axios from "src/config/axios";

class StaticticsApi {
  async getAllUserMonthlyAttendance(query: any) {
    const response = await Axios.get(
      `/statistics/employeesMonthlyAttendance?month=${query.month}&year=${query.year}`
    );

    return response;
  }

  async getAllUserAvailability() {
    const response = await Axios.get(`/statistics/todayAttendanceStatus`);

    return response;
  }

  async getTotalUsers() {
    const response = await Axios.get("/statistics/calculateUsers");

    return response;
  }
}

export const statisticsApi = new StaticticsApi();
