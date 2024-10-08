import { IconButton, SvgIcon } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getClassDate, getClassTime, getUserTimeZone } from "src/utils";
import { toast } from "react-toastify";
import { Meeting } from "src/types";
import { paths } from "src/constants/paths";

export const CoptToClipboard = ({ meeting }: { meeting: Meeting }) => {
  const formatRecurringDays = (days: string[]) =>
    days.map((day) => day.slice(0, 3)).join(", ");

  const meetingInformation = `${
    process.env.NEXT_PUBLIC_COMPANY_NAME
  } is inviting you to a ${
    meeting.recurring ? "recurring meeting" : "meeting"
  }\n\n${
    meeting.recurring
      ? `Days: ${formatRecurringDays(meeting.meeting_days)}`
      : `Date: ${getClassDate(meeting.time)}`
  }\nTime: ${getClassTime(meeting.time)} ${getUserTimeZone()}\n\nAgenda: ${
    meeting.title
  }\nJoin Meeting\n${process.env.NEXT_PUBLIC_COMPANY_DOMAIN}${paths.meetings}/${
    meeting._id
  }`;

  const handleCopyClick = (information: any) => {
    navigator.clipboard
      .writeText(information)
      .then(() => {
        toast.success("Copied to Clipboard");
      })
      .catch((error) => {});
  };

  return (
    <IconButton onClick={() => handleCopyClick(meetingInformation)}>
      <SvgIcon>
        <ContentCopyIcon />
      </SvgIcon>
    </IconButton>
  );
};
