import { SeverityPillColor } from "src/components";

export const AttendanceStatus = {
  ONLINE: "online",
  SHORT_ATTENDANCE: "short_attendance",
  FULL_DAY_ABSENT: "full_day_absent",
  HALF_DAY_PRESENT: "half_day_present",
  FULL_DAY_PRESENT: "full_day_present",
};

export const LeavesStatus = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

const Sick = "sick";
const Casual = "casual";
const Half_Day = "half_day";
const Emergency = "emergency";

export const LeavesTypes = [
  {
    label: "Sick Leave",
    value: Sick,
  },
  {
    label: "Casual Leave",
    value: Casual,
  },
  {
    label: "HalfDay Leave",
    value: Half_Day,
  },
  {
    label: "Emergency Leave",
    value: Emergency,
  },
];

export const AccountStatus = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Suspend",
    value: "suspend",
  },
  {
    label: "Terminate",
    value: "terminate",
  },
];
export const MeetingStatus = [
  {
    label: "Upcoming Meetings",
    value: "upcoming",
  },
  {
    label: "Previous Meetings",
    value: "completed",
  },
];
