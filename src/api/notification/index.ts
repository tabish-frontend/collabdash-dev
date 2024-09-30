import Axios from "src/config/axios";

class NotificationsApi {
  async getNotifications() {
    const response = await Axios.get(`/notifications`);

    return response.data;
  }
  async subscribeUser(subscription: PushSubscription) {
    await Axios.post(`/subscriptions/subscribe`, subscription);
  }
  async removeSubscribedUser() {
    await Axios.post(`/subscriptions/remove`);
  }
}

export const notificationsApi = new NotificationsApi();
