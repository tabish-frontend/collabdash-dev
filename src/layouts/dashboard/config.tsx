import Groups2Icon from "@mui/icons-material/Groups2";
import MoodIcon from "@mui/icons-material/Mood";
import { SvgIcon } from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { paths } from "src/constants/paths";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth";
import OverviewIcon from "src/icons/overview-icon";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import CheckDone01Icon from "src/icons/untitled-ui/duocolor/check-done-01";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PaymentsIcon from "@mui/icons-material/Payments";
import CubeOutline from "mdi-material-ui/CubeOutline";
import HomeOutline from "mdi-material-ui/HomeOutline";
import FormatLetterCase from "mdi-material-ui/FormatLetterCase";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}

// const super_admin = [
//   {
//     title: "Dashboard",
//     path: paths.dashboard,
//     id: "super_admin_overview",
//     icon: (
//       <SvgIcon>
//         <OverviewIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Admins",
//     path: paths.admins,
//     id: "admins",
//     icon: (
//       <SvgIcon>
//         <ManageAccountsIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Teachers",
//     path: paths.teachers,
//     id: "super_admin_teachers",
//     icon: (
//       <SvgIcon>
//         <Groups2Icon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Parents",
//     path: paths.parents,
//     id: "super_admin_parents",
//     icon: (
//       <SvgIcon>
//         <PeopleIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Students",
//     path: paths.students,
//     id: "super_admin_students",
//     icon: (
//       <SvgIcon>
//         <SchoolIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Time Table",
//     path: paths.classes,
//     id: "super_admin_classes",
//     icon: (
//       <SvgIcon>
//         <CalendarMonthIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Log Book",
//     path: paths.log_book,
//     id: "super_admin_logbook",
//     icon: (
//       <SvgIcon>
//         <EditNoteIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Invoices",
//     path: paths.invoices,
//     id: "super_admin_invoices",
//     icon: (
//       <SvgIcon>
//         <ReceiptIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Kanban",
//     path: paths.kanban,
//     id: "kanban",
//     icon: (
//       <SvgIcon>
//         <CheckDone01Icon />
//       </SvgIcon>
//     ),
//   },
//   // {
//   //   title: "Payrolls",
//   //   path: paths.payrolls,
//   //   icon: (
//   //     <SvgIcon>
//   //       <PaymentsIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
//   // {
//   //   title: "Feedback",
//   //   path: paths.feedback,
//   //   icon: (
//   //     <SvgIcon>
//   //       <FeedbackIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
// ];

// const admin = [
//   {
//     title: "Admin Hub",
//     path: paths.dashboard,
//     id: "admin_overview",
//     icon: (
//       <SvgIcon>
//         <OverviewIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Teachers",
//     path: paths.teachers,
//     id: "admin_teachers",
//     icon: (
//       <SvgIcon>
//         <Groups2Icon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Parents",
//     path: paths.parents,
//     id: "admin_parents",
//     icon: (
//       <SvgIcon>
//         <PeopleIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Students",
//     path: paths.students,
//     id: "admin_students",
//     icon: (
//       <SvgIcon>
//         <SchoolIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Time Table",
//     path: paths.classes,
//     id: "admin_classes",
//     icon: (
//       <SvgIcon>
//         <CalendarMonthIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Log Book",
//     path: paths.log_book,
//     id: "admin_logbook",
//     icon: (
//       <SvgIcon>
//         <EditNoteIcon />
//       </SvgIcon>
//     ),
//   },

//   // {
//   //   title: "Feedback",
//   //   path: paths.feedback,
//   //   icon: (
//   //     <SvgIcon>
//   //       <FeedbackIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
// ];

// const teacher = [
//   {
//     title: "Teacher Hub",
//     path: paths.dashboard,
//     id: "teacher_overview",
//     icon: (
//       <SvgIcon>
//         <OverviewIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Time Table",
//     path: paths.classes,
//     id: "teacher_classes",
//     icon: (
//       <SvgIcon>
//         <CalendarTodayIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Students",
//     path: paths.students,
//     id: "teacher_students",
//     icon: (
//       <SvgIcon>
//         <SchoolIcon />
//       </SvgIcon>
//     ),
//   },
//   // {
//   //   title: "Payrolls",
//   //   path: paths.payrolls,
//   //   icon: (
//   //     <SvgIcon>
//   //       <PaymentsIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
//   // {
//   //   title: "Feedback",
//   //   path: paths.feedback,
//   //   icon: (
//   //     <SvgIcon>
//   //       <FeedbackIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
// ];

// const parent = [
//   {
//     title: "Dashboard",
//     path: paths.dashboard,
//     id: "parent_overview",
//     icon: (
//       <SvgIcon>
//         <OverviewIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "Student Hub",
//     path: paths.childrens,
//     id: "parent_childrens",
//     icon: (
//       <SvgIcon>
//         <DashboardCustomizeIcon />
//       </SvgIcon>
//     ),
//   },
//   // {
//   //   title: "Invoices",
//   //   path: paths.invoices,
//   //   id: "parent_invoices",
//   //   icon: (
//   //     <SvgIcon>
//   //       <ReceiptIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
//   // {
//   //   title: "Feedback",
//   //   path: paths.feedback,
//   //   icon: (
//   //     <SvgIcon>
//   //       <FeedbackIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
// ];

// const student = [
//   {
//     title: "Student Hub",
//     path: paths.dashboard,
//     id: "student_overview",
//     icon: (
//       <SvgIcon>
//         <OverviewIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "My Time Table",
//     path: paths.classes,
//     id: "student_classes",
//     icon: (
//       <SvgIcon>
//         <CalendarTodayIcon />
//       </SvgIcon>
//     ),
//   },
//   // {
//   //   title: "Invoices",
//   //   path: paths.invoices,
//   //   id: "student_invoices",
//   //   icon: (
//   //     <SvgIcon>
//   //       <ReceiptIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
//   // {
//   //   title: "Feedback",
//   //   path: paths.feedback,
//   //   icon: (
//   //     <SvgIcon>
//   //       <FeedbackIcon />
//   //     </SvgIcon>
//   //   ),
//   // },
// ];

const hrRoutes = [
  {
    title: "Dashboard",
    path: paths.index,
    icon: (
      <SvgIcon>
        <HomeOutline />
      </SvgIcon>
    ),
  },
  {
    title: "Employees",
    path: paths.employees,
    icon: (
      <SvgIcon>
        <AccountCogOutline />
      </SvgIcon>
    ),
  },
  {
    title: "Attendance",
    path: paths.attendance,
    icon: (
      <SvgIcon>
        <CubeOutline />
      </SvgIcon>
    ),
  },
  {
    title: "Holidays",
    path: paths.holidays,
    icon: (
      <SvgIcon>
        <CubeOutline />
      </SvgIcon>
    ),
  },
  {
    title: "Leaves",
    path: paths.leaves,
    icon: (
      <SvgIcon>
        <FormatLetterCase />
      </SvgIcon>
    ),
  },
  {
    title: "Tasks",
    path: paths.tasks,
    icon: (
      <SvgIcon>
        <ManageAccountsIcon />
      </SvgIcon>
    ),
  },
];

export const useSections = () => {
  const { user } = useAuth<AuthContextType>();

  console.log("User", user);

  let items: any = [];
  switch (user?.role) {
    case "hr":
      items = hrRoutes;
      break;
    case "admin":
      items = hrRoutes;
      break;
    default:
      hrRoutes;
  }

  return useMemo(() => {
    return [{ items }];
  }, []);
};
