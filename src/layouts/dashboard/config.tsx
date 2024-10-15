import { SvgIcon } from "@mui/material";
import { useMemo, type ReactNode } from "react";
import { paths } from "src/constants/paths";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth";
import {
  HomeOutline,
  AccountMultipleOutline,
  CubeOutline,
  BullhornOutline,
  FileTreeOutline,
  CardAccountDetailsStarOutline,
} from "mdi-material-ui";
import DuoIcon from "@mui/icons-material/Duo";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import HomeIcon from "@mui/icons-material/Home";

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
  roles?: string[];
}

export interface Section {
  items: Item[];
  subheader?: string;
}

const navItems: Item[] = [
  {
    title: "Dashboard",
    icon: <SvgIcon component={HomeIcon} />,
    path: paths.index,
  },
  {
    title: "Team Members",
    icon: <SvgIcon component={AccountMultipleOutline} />,
    path: paths.employees,
    roles: ["admin", "hr"],
  },
  {
    title: "Attendance",
    icon: <SvgIcon component={CubeOutline} />,
    path: paths.attendance,
  },
  {
    title: "Leaves",
    icon: <SvgIcon component={CardAccountDetailsStarOutline} />,
    path: paths.leaves,
  },
  {
    title: "Holidays",
    icon: <SvgIcon component={BullhornOutline} />,
    path: paths.holidays,
  },
  {
    title: "Collab Chat",
    path: paths.chat,
    icon: <SvgIcon component={ChatIcon} />,
  },
  {
    title: "Collab Meetings",
    path: paths.meetings,
    icon: <SvgIcon component={DuoIcon} />,
  },
  {
    title: "Collab Spaces",
    icon: <SvgIcon component={AutoAwesomeMotionIcon} />,
    path: paths.workspaces,
  },
  {
    title: "Callender",
    icon: <SvgIcon component={CalendarMonthIcon} />,
    path: paths.calender,
  },
];

export const useSections = (): Section[] => {
  const { user } = useAuth<AuthContextType>();

  const filteredNavItems = useMemo(() => {
    const items = navItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.role ?? "");
    });

    return items;
  }, [user?.role]);

  return useMemo(() => {
    return [{ items: filteredNavItems }];
  }, [filteredNavItems]);
};

// import type { ReactNode } from "react";
// import { useMemo } from "react";
// import SvgIcon from "@mui/material/SvgIcon";
// import CheckDone01Icon from "src/icons/untitled-ui/duocolor/check-done-01";
// import HomeSmileIcon from "src/icons/untitled-ui/duocolor/home-smile";
// import LineChartUp04Icon from "src/icons/untitled-ui/duocolor/line-chart-up-04";
// import Users03Icon from "src/icons/untitled-ui/duocolor/users-03";
// import { paths } from "src/constants/paths";

// export interface Item {
//   disabled?: boolean;
//   external?: boolean;
//   icon?: ReactNode;
//   items?: Item[];
//   label?: ReactNode;
//   path?: string;
//   title: string;
// }

// export interface Section {
//   items: Item[];
//   subheader?: string;
// }

// export const useSections = () => {
//   return useMemo(() => {
//     return [
//       {
//         items: [
//           {
//             title: "Dashboard",
//             path: paths.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <HomeSmileIcon />
//               </SvgIcon>
//             ),
//           },
//           {
//             title: "Employees",
//             path: paths.employees,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <Users03Icon />
//               </SvgIcon>
//             ),
//           },
//         ],
//       },
//       {
//         items: [
//           {
//             title: "Time Management",
//             path: paths.attendance,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <LineChartUp04Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: "Attendance",
//                 path: paths.attendance,
//               },
//               {
//                 title: "Holidays",
//                 path: paths.holidays,
//               },
//               {
//                 title: "Leaves",
//                 path: paths.leaves,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         items: [
//           {
//             title: "Tasks",
//             path: paths.tasks,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <CheckDone01Icon />
//               </SvgIcon>
//             ),
//           },
//         ],
//       },
//     ];
//   }, []);
// };
