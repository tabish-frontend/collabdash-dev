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

  const items = useMemo(() => {
    switch (user?.role) {
      case "hr":
      case "admin":
        return hrRoutes;
      default:
        return [];
    }
  }, [user?.role]);

  return useMemo(() => {
    return [{ items }];
  }, [items]);
};
