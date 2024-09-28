import Axios from "src/config/axios";
import { Contact } from "src/types";

type GetContactsRequest = {
  query?: string;
};

type GetContactsResponse = Promise<Contact[]>;

class ContactAPI {
  async getContacts(request: GetContactsRequest = {}): GetContactsResponse {
    const { query } = request;

    const response = await Axios.get(`/contacts?search=${query}`);

    return response.data;
  }
}

export const contactsApi = new ContactAPI();
