import { combineReducers } from "@reduxjs/toolkit";

import { reducer as chatReducer } from "src/store/slices/chat";

export const rootReducer = combineReducers({
  chat: chatReducer,
});
