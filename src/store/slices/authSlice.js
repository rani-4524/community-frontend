// handle all user related tasks
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    makeHost: (state) => {
      if (state.user) {
        state.user.role = "host";
      }
    },
    updateProfilePic: (state, action) => {
      if (state.user) {
        state.user.profilePicUrl = action.payload;
      }
    },
  },
});

export default authSlice.reducer;
export const { login, logout, makeHost, updateProfilePic } = authSlice.actions;
