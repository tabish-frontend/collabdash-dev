import Axios from "src/config/axios";

class EmployeesApi {
  async getAllEmployees(filters: any) {
    const response = await Axios.get(
      `/employees?fields=${filters.fields}&account_status=${filters.account_status}&search=${filters.search}`
    );

    return response.data;
  }

  async getEmployee(username: string | string[] | undefined) {
    const response = await Axios.get(`/employees/${username}`);

    return response.data;
  }

  async createEmployee(body: object) {
    const response = await Axios.post(`/employees`, body);

    return response;
  }

  async updateEmployee(username: string, body: object) {
    const response = await Axios.patch(`/employees/${username}`, body);

    return response.data;
  }

  async deleteEmployee(username: string | string[]) {
    const response = await Axios.delete(`/employees/${username}`);
    return response.data;
  }
}

export const employeesApi = new EmployeesApi();
