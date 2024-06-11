import { combineReducers } from "@reduxjs/toolkit";

import { reducer as kanbanReducer } from "./slices/kanban";

export const rootReducer = combineReducers({
  kanban: kanbanReducer,
});
