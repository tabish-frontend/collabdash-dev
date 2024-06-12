import { createContext } from "react";
import { Login, UpdatePassword, User } from "src/types";

export interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  attendance: any | null;
}

export const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  attendance: null,
};

export interface AuthContextType extends State {
  initialize: () => Promise<void>;
  signIn: (body: Login) => Promise<void>;
  changePassword: (body: UpdatePassword) => Promise<void>;
  signOut: () => Promise<void>;
  updateCurrentUser: (user: any) => void;
  updateAttendanceLog: (action: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  initialize: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  updateCurrentUser: (user: any) => user,
  updateAttendanceLog: (attendance: any) => attendance,
});
