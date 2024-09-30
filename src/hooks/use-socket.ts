import { useContext } from "react";
import {
  SocketContext,
  SocketContextType,
} from "src/contexts/socket/socket-context";

export const useSocketContext = <T = SocketContextType>() =>
  useContext(SocketContext) as T;
