import {
  Employee,
  ForgotPassword,
  Holiday,
  Leaves,
  Login,
  ResetPassword,
  Shift,
  UpdatePassword,
  WorkSpace,
  WorkSpaceBoard,
} from "src/types";

// ** AUTH Initial Values
export const LoginInitialValues: Login = {
  email: "",
  password: "",
};

export const ForgotPasswordInitialValues: ForgotPassword = {
  email: "",
};

export const ResetPasswordInitialValues: ResetPassword = {
  password: "",
  password_confirm: "",
};

export const UpdateMyPassword: UpdatePassword = {
  current_password: "",
  password: "",
  password_confirm: "",
};

// ** Employee Initial Values
export const employeeInitialValues: Employee = {
  username: "",
  full_name: "",
  mobile: "",
  role: "employee",
  email: "",
  qualification: "",
  gender: "",
  department: "",
  designation: "",
  company: "",
  account_status: "active",
  national_identity_number: undefined,
};

export const holidayInitialValues: Holiday = {
  _id: "",
  title: "",
  date: null,
  users: [],
};

export const leaveInitialValues: Leaves = {
  _id: "",
  user: "",
  startDate: null,
  endDate: null,
  reason: "",
  leave_type: "",
  status: "",
};

export const shiftInitialValues: Shift = {
  _id: "",
  user: "",
  shift_type: "Fixed",
  hours: 0,
  times: [
    {
      start: null,
      end: null,
      days: [],
    },
  ],
  weekends: [],
};

export const workSpaceInitialValues: WorkSpace = {
  _id: "",
  name: "",
  slug: "",
  owner: "",
  members: [],
  boards: [],
};

export const BoardInitialValues: WorkSpaceBoard = {
  _id: "",
  name: "",
  slug: "",
  description: "",
  workspace: "",
  owner: "",
  members: [],
  columns: [],
  tasks: [],
};
