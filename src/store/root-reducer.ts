import { combineReducers } from "@reduxjs/toolkit";

import { reducer as calendarReducer } from "./slices/calendar";
import { reducer as kanbanReducer } from "./slices/kanban";
// import { reducer as userReducer } from "./slices/user";
// import { reducer as adminReducer } from "./slices/admins";

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  kanban: kanbanReducer,
  // auth: userReducer,
});
