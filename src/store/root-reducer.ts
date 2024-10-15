import { combineReducers } from "@reduxjs/toolkit";

import { reducer as calendarReducer } from "src/store/slices/calendar";
import { reducer as chatReducer } from "src/store/slices/chat";

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
});
