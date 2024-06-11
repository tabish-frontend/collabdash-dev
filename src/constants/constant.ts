import { SeverityPillColor } from "src/components";
import { Permissions } from "src/types";

export const SUPER_ADMIN = "super_admin";
export const ADMIN = "admin";
export const TEACHER = "teacher";
export const PARENT = "parent";
export const CHILD = "child";
export const STUDENT = "student";

export const PENDING = "pending";
export const REJECTED = "rejected";
export const ACTIVE = "active";
export const IN_ACTIVE = "inactive";
export const BLOCKED = "blocked";

export const status = [PENDING, REJECTED, ACTIVE, IN_ACTIVE, BLOCKED];

export const roles = {
  SUPER_ADMIN,
  ADMIN,
  TEACHER,
  PARENT,
  CHILD,
  STUDENT,
};

export const statusMap: Record<string, SeverityPillColor> = {
  pending: "info",
  under_review: "primary",
  approved: "info",
  rejected: "warning",
  active: "success",
  inactive: "primary",
  confirmed: "success",
  blocked: "error",
  deleted: "error",
  on_hold: "primary",
};

export const classTypeMap: Record<string, SeverityPillColor> = {
  regular: "info",
  demo: "primary",
};

const scheduled = "Schedule";
const re_scheduled = "Re_Schedule";
const edit = "Edit";
const cancelled = "Cancelled";
const pause = "Paused";
const extra = "Extra_Class";
const make_up = "MakeUp_Class";
const _delete = "Delete";

export const classTitle = {
  scheduled,
  re_scheduled,
  edit,
  cancelled,
  pause,
  extra,
  make_up,
  _delete,
};

export const getClassColor = (title: string) => {
  switch (title) {
    case classTitle.scheduled:
      return "#4DA689";
    case classTitle.re_scheduled:
      return "#06AED4";
    case classTitle.edit:
      return "#F79009";
    case classTitle.cancelled:
      return "#E81E61";
    case classTitle.pause:
      return "#F79009";
    case classTitle.make_up:
      return "#8B008B";

    default:
      return "#01579b";
  }
};

export const formatSessionTitle = (title: string) => {
  if (title === classTitle.scheduled) {
    return "Scheduled";
  } else if (title === classTitle.re_scheduled) {
    return "Re-Scheduled";
  } else {
    return title;
  }
};

export const account_type = {
  STUDENT,
  CHILD,
};

export const roleMap: Record<string, SeverityPillColor> = {
  student: "primary",
  child: "warning",
};

export const classStatusMap: Record<string, SeverityPillColor> = {
  Schedule: "success",
  Re_Scheduled: "primary",
  Cancelled: "error",
  Paused: "warning",
};

export const AdminPermissions = (role: string, permissions: Permissions) => {
  return {
    UserManagement: {
      Read: role === roles.SUPER_ADMIN || permissions?.user_management._read,
      Create:
        role === roles.SUPER_ADMIN || permissions?.user_management._create,
      Update:
        role === roles.SUPER_ADMIN || permissions?.user_management._update,
      Delete:
        role === roles.SUPER_ADMIN || permissions?.user_management._remove,
    },
    ClassManagement: {
      Read: role === roles.SUPER_ADMIN || permissions?.class_management._read,
      Create:
        role === roles.SUPER_ADMIN || permissions?.class_management._create,
      Update:
        role === roles.SUPER_ADMIN || permissions?.class_management._update,
      Delete:
        role === roles.SUPER_ADMIN || permissions?.class_management._remove,
    },
    FinanceManagement: {
      Read: role === roles.SUPER_ADMIN || permissions?.finance._read,
    },
  };
};

export const subjects = [
  "Maths",
  "Further Maths",
  "Decision Mathematics",
  "Pure Maths",
  "Pre Calculus",
  "SAT (Maths)",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "English as a first language",
  "English as a second language",
  "English Literature",
  "SAT (English)",
  "Arabic",
  "Accounting",
  "British History",
  "Business Studies",
  "Communication Lessons",
  "Computer Science",
  "Combined Sciences",
  "Environmental science",
  "Economics",
  "French",
  "Hindi",
  "History",
  "ICT",
  "IT",
  "Islamiat",
  "Law",
  "Mechanics",
  "Pakistan Studies",
  "Psychology",
  "Science",
  "Holy Quran",
  "Social Studies",
  "Sociology",
  "Spanish",
  "Statistics",
  "Urdu",
  "Other",
];

export const gradeLevels = [
  "Grade 13",
  "Grade 12",
  "Grade 11",
  "Grade 10",
  "Grade 9",
  "Grade 8",
  "Grade 7",
  "Grade 6",
  "Grade 5",
  "Grade 4",
  "Grade 3",
  "Grade 2",
  "Grade 1",
];

export const examBoard = [
  "Not Applicable",
  "Cambridge",
  "Edexcel",
  "AQA",
  "oxford",
  "Other",
];
export const curriculum = [
  "British",
  "CBSE",
  "ICSE",
  "International Baccalaureate",
  "American",
  "SABIS",
  "FBISE",
  "French",
  "Canadian",
  "Australian",
  "Online/Homeschooling",
  "Other",
];

export const Permissions_Tooltip = [
  {
    create:
      "Grant Super-Admin Status: Allow the admin to assign super-admin privileges to other users, giving them full control over the system",
  },
  {
    create: "Allow the admin to create new user accounts within the system",
    edit: "Enable the admin to modify user details such as names, email addresses, and roles",
    delete: " Grant the ability to delete user accounts",
  },
  {
    create: "Allow the admin to create new class or learning modules",
    edit: "Enable the admin to modify class details, such as titles, descriptions, and content",
    delete: "Grant the ability to remove classes from the system",
  },
  {
    create:
      "Allow the admin to upload learning materials, documents, videos, etc",
    edit: "Enable the admin to modify uploaded content.",
    delete: "Grant the ability to remove content from the system",
  },
  {
    create: " Allow the admin to create quizzes, tests, assignments, etc",
    edit: "Enable the admin to review and grade assessments submitted by users",
    delete: "Grant the ability to adjust grades if needed",
  },
  {
    create:
      "Allow the admin to access usage statistics and performance analytics",
    edit: "Enable the admin to generate reports on user progress, course completion, etc",
  },
  {
    create: "Allow the admin to send notifications or announcements to users",
    delete: "Users: Enable the admin to contact users via email",
  },
  {
    create:
      "Allow the admin to modify system-wide settings, such as branding, default course settings, etc.",
    edit: "Enable the admin to adjust permissions for other roles within the system",
  },
  {
    create: " Allow the admin to reset passwords for users",
    edit: "Grant the ability to view logs of user activity for security purposes",
  },
];

export const Weeks = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const Hours = Array.from({ length: 24 }, (_, index) => index + 1);
export const Minutes = [0, 15, 30, 45];
export const NumberOfSessions = Array.from(
  { length: 10 },
  (_, index) => index + 1
);
