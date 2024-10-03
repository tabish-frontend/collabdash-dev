import Axios from "src/config/axios";

class TodosAPI {
  async addTodos(body: { title: string; date: Date }) {
    const response = await Axios.post(`/todos`, body);

    return response.data;
  }
  async getTodos(date: Date) {
    const response = await Axios.get(`/todos?date=${date}`);

    return response.data;
  }

  async updateTodo(id: string, body: any) {
    const response = await Axios.patch(`/todos/${id}`, body);
    return response.data;
  }

  async deleteTodo(id: string) {
    const response = await Axios.delete(`/todos/${id}`);
    return response.data;
  }
}

export const todosApi = new TodosAPI();
