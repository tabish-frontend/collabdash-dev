import Axios from "src/config/axios";
import { Employee, WorkSpace } from "src/types";

class ThreadAPI {
  async getAllThreads() {
    const response = await Axios.get(`/messages`);
    return response;
  }

  async getThreadbyId(threadId: string) {
    const response = await Axios.get(`/messages/${threadId}`);
    return response;
  }

  async sendMessage(body: any) {
    const response = await Axios.post(`/messages/send`, body);
    return response;
  }
}

export const threadApi = new ThreadAPI();
