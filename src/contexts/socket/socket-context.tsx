import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_DOMAIN, {
        query: {
          userId: user._id,
        },
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
