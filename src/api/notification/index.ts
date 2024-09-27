import Axios from "src/config/axios";

class NotificationsApi {
  async getNotifications() {
    const response = await Axios.get(`/notifications`);

    return response.data;
  }
  async subscribeUser(subscription: PushSubscription) {
    const response = await Axios.post(`/subscriptions/subscribe`, subscription);
    // return response.data;
  }
  async removeSubscribedUser() {
    const response = await Axios.post(`/subscriptions/remove`);
    return response.data;
  }
}

export const notificationsApi = new NotificationsApi();
