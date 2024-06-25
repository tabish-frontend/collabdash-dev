import { statusMapping } from "src/constants/attendance-status";

export const getStatusDetails = (status: string) => {
  return statusMapping[status] || { icon: null, title: "Unknown Status" };
};
