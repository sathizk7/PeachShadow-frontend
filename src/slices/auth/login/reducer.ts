import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  error: "", // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const loginSlice  = createSlice({
  name: "login",
  initialState,
  reducers: {
    apiError(state, action) {
      // Accept either a string error or an object with `.data` or `.message`
      const payload = action.payload;
      let message = '';
      if (!payload) {
        message = 'Unknown error';
      } else if (typeof payload === 'string') {
        message = payload;
      } else if (payload.data) {
        message = payload.data;
      } else if (payload.message) {
        message = payload.message;
      } else {
        try {
          message = JSON.stringify(payload);
        } catch (e) {
          message = String(payload);
        }
      }

      state.error = message;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = "";
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;