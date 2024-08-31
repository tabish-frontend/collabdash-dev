import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoaded: false,
  columns: {
    byId: {},
    allIds: [],
  },
  tasks: {
    byId: {},
    allIds: [],
  },
  members: {
    byId: {},
    allIds: [],
  },
};

const reducers = {};

export const slice = createSlice({
  name: "kanban",
  initialState,
  reducers,
});

export const { reducer } = slice;
