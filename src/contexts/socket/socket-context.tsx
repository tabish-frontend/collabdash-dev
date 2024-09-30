import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks";
import { AuthContextType } from "../auth";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: ReactNode;
}

// Define types for socket context
export interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider: FC<SocketProviderProps> = (props) => {
  const { children } = props;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { user } = useAuth<AuthContextType>();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL!.replace("/api/v1", "");

  useEffect(() => {
    if (user) {
      const newSocket = io(BACKEND_URL, {
        query: {
          userId: encodeURIComponent(user._id),
        },
        transports: ["websocket"], // Force WebSocket transport
        withCredentials: true, // Ensure credentials are sent
      });

      setSocket(newSocket);

      // Listen to the online users event
      newSocket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      // Cleanup the socket connection on component unmount or user change
      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // Only re-run this effect when the user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Chat GPT GIVES #1

// useEffect(() => {
//   if (user) {
//     const newSocket = io(BACKEND_URL, {
//       query: {
//         userId: user._id,
//       },
//       transports: ['websocket'],  // Force WebSocket transport
//     });

//     setSocket(newSocket);

//     // Listen to the online users event
//     newSocket.on("getOnlineUsers", (users: string[]) => {
//       setOnlineUsers(users);
//     });

//     // Cleanup the socket connection on component unmount or user change
//     return () => {
//       newSocket.close();
//     };
//   } else {
//     if (socket) {
//       socket.close();
//       setSocket(null);
//     }
//   }
//   // Only re-run this effect when the user changes
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [user]);

// Chat GPT GIVES #2

// useEffect(() => {
//   if (user) {
//     const newSocket = io(BACKEND_URL, {
//       query: {
//         userId: user._id,
//       },
//       transports: ['polling'], // Use polling if WebSocket is unavailable
//       polling: {
//         interval: 10000, // Increase the interval to 10 seconds
//       },
//     });

//     setSocket(newSocket);

//     // Listen to the online users event
//     newSocket.on("getOnlineUsers", (users: string[]) => {
//       setOnlineUsers(users);
//     });

//     // Cleanup the socket connection on component unmount or user change
//     return () => {
//       newSocket.close();
//     };
//   } else {
//     if (socket) {
//       socket.close();
//       setSocket(null);
//     }
//   }
//   // Only re-run this effect when the user changes
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [user]);
