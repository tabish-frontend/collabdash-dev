// // authSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isInitialized: false,
//   isAuthenticated: false,
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     initialize: (state, action) => {
//       const { isAuthenticated, user } = action.payload;
//       return {
//         ...state,
//         isAuthenticated,
//         isInitialized: true,
//         user,
//       };
//     },
//     signIn: (state, action) => {
//       const { user } = action.payload;
//       state.isAuthenticated = true;
//       state.user = user;
//     },
//     signOut: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//   },
// });

// export const { initialize, signIn, signOut } = authSlice.actions;
// export const { reducer } = authSlice;
