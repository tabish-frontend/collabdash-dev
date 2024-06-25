"use client";

import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { authApi } from "src/api/auth";

import type { State } from "./auth-context";
import { AuthContext, initialState } from "./auth-context";
import { Login, UpdatePassword, User } from "src/types";
import { attendanceApi } from "src/api";

// import Cookies from 'js-cookie'

const STORAGE_KEY = "accessToken";

enum ActionType {
  INITIALIZE = "INITIALIZE",
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
  SIGN_OUT = "SIGN_OUT",
  CHANGE_PSWD = "CHANGE_PSWD",
  UPDATE_ATTENDANCE = "UPDATE_ATTENDANCE",
  UPDATE_USER = "UPDATE_USER",
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
    attendance: any | null;
  };
};

type SignInAction = {
  type: ActionType.SIGN_IN;
  payload: {
    user: User;
    attendance: any;
  };
};

type UpdateUserAction = {
  type: ActionType.UPDATE_USER;
  payload: {
    user: User;
  };
};

type UpdateAttendanceAction = {
  type: ActionType.UPDATE_ATTENDANCE;
  payload: {
    attendance: any;
  };
};

type ChangePswdAction = {
  type: ActionType.CHANGE_PSWD;
  payload: {
    user: User;
  };
};

type SignUpAction = {
  type: ActionType.SIGN_UP;
  payload: {
    user: User;
  };
};

type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type Action =
  | InitializeAction
  | SignInAction
  | SignUpAction
  | SignOutAction
  | ChangePswdAction
  | UpdateAttendanceAction
  | UpdateUserAction;

type Handler = (state: State, action: any) => State;

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user, attendance } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      attendance,
    };
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { user, attendance } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      attendance,
    };
  },

  UPDATE_USER: (state: State, action: UpdateUserAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },

  UPDATE_ATTENDANCE: (state: State, action: UpdateAttendanceAction): State => {
    const { attendance } = action.payload;

    return {
      ...state,
      attendance,
    };
  },

  CHANGE_PSWD: (state: State, action: ChangePswdAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  SIGN_UP: (state: State, action: SignUpAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async (): Promise<void> => {
    try {
      const accessToken = window.localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        const user = await authApi.me();

        const attendance_response = await attendanceApi.getTodayAttendance();

        if (attendance_response) {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: user.data,
              attendance: attendance_response.data.attendance,
            },
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: user.data,
              attendance: null,
            },
          });
        }
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
            attendance: null,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
          attendance: null,
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signIn = useCallback(
    async (body: Login): Promise<void> => {
      const response = await authApi.signIn(body);

      if (response) {
        const token = response?.data.accessToken;
        localStorage.setItem(STORAGE_KEY, token);

        const user = await authApi.me();
        const attendance_response = await attendanceApi.getTodayAttendance();

        if (attendance_response) {
          dispatch({
            type: ActionType.SIGN_IN,
            payload: {
              user: user.data,
              attendance: attendance_response.data.attendance,
            },
          });
        } else {
          dispatch({
            type: ActionType.SIGN_IN,
            payload: {
              user: user.data,
              attendance: null,
            },
          });
        }
      }
    },
    [dispatch]
  );

  const changePassword = useCallback(
    async (body: UpdatePassword): Promise<void> => {
      await authApi.changePassword(body);
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: ActionType.SIGN_OUT });
    },
    [dispatch]
  );

  const updateAttendanceLog = useCallback(
    async (action: any): Promise<void> => {
      const response = await attendanceApi.manageAttendance(action);

      dispatch({
        type: ActionType.UPDATE_ATTENDANCE,
        payload: {
          attendance: response.data.attendance,
        },
      });
    },
    [dispatch]
  );

  const signOut = useCallback(async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  const updateCurrentUser = useCallback(
    async (updatingValues: object): Promise<void> => {
      const updatedUser = await authApi.update_me(updatingValues);

      dispatch({
        type: ActionType.UPDATE_USER,
        payload: {
          user: updatedUser.data,
        },
      });
    },
    [dispatch]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        changePassword,
        initialize,
        signOut,
        updateCurrentUser,
        updateAttendanceLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
