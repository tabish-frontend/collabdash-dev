import type { TypedUseSelectorHook } from "react-redux";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import type { ThunkAction } from "redux-thunk";
import type { AnyAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer,
});
