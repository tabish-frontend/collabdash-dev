import { Link } from "@mui/material";
import { RouterLink } from "./router-link";
import { paths } from "src/constants/paths";
import { Logo } from "./logos";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { JitsiConfigOverwrite } from "src/constants/jitsi-config";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";

interface ConferenceRoomProps {
  readOnlyName: boolean;
  RoomName: string;
  onConferenceLeft?: () => void; // Optional prop, only passed when needed
}

export const ConferenceRoom: React.FC<ConferenceRoomProps> = ({
  readOnlyName,
  RoomName,
  onConferenceLeft, // Optional event listener
}) => {
  const { user } = useAuth<AuthContextType>();

  return (
    <div style={{ height: "100vh", overflowY: "hidden", position: "relative" }}>
      <Link
        component={RouterLink}
        href={paths.index}
        target="_blank"
        sx={{
          position: "absolute",
          top: 20,
          left: 10,
          width: 150,
          textDecoration: "none",
        }}
      >
        <Logo />
      </Link>

      <JitsiMeeting
        domain="meet.collabdash.io"
        roomName={RoomName}
        configOverwrite={{
          ...JitsiConfigOverwrite,
          readOnlyName,
        }}
        interfaceConfigOverwrite={{}}
        userInfo={{
          displayName: user?.full_name || "Guest User",
          email: user?.email || "user@gmail.com",
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
        onApiReady={(externalApi) => {
          console.log("Jitsi Meeting API is ready!", externalApi);

          // Add listener for videoConferenceLeft if the prop is passed
          if (onConferenceLeft) {
            externalApi.addListener("videoConferenceLeft", () => {
              onConferenceLeft(); // Trigger the callback when the user leaves
            });
          }
        }}
      />
    </div>
  );
};
