//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postBackendLogin,
  postBackendLogout,
} from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import axios from 'axios';
import { setAuthorization, getRefreshToken } from '../../../helpers/api_helper';

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend : any = getFirebaseBackend();
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });

    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      // support for local backend API: set REACT_APP_DEFAULTAUTH=backend
      if (process.env.REACT_APP_DEFAULTAUTH === "backend") {
        response = postBackendLogin({ email: user.email, password: user.password });
      } else {
        response = postFakeLogin({
          email: user.email,
          password: user.password,
        });
      }
    }

    var data = await response;

    if (data) {
      // For backend auth we expect either { token, user } or { accessToken, data: { ... } } or similar.
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        // Keep existing fake behavior
        sessionStorage.setItem("authUser", JSON.stringify(data));
        var finallogin: any = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if (finallogin.status === "success") {
          dispatch(loginSuccess(data));
          history('/dashboard');
        } else {
          dispatch(apiError(finallogin));
        }
      } else if (process.env.REACT_APP_DEFAULTAUTH === "backend") {
        // Normalize backend response
        // `data` might be { token, user } or { accessToken, user } or { status, data }
        let token = data.token || data.accessToken || (data.data && data.data.token) || null;
        let refreshToken = data.refreshToken || (data.data && data.data.refreshToken) || null;
        // derive user object and strip any token-like fields if response is the full object
        const rawUser = data.user || (data.data && data.data.user) || data.data || data;
        let user: any = rawUser;
        if (rawUser && typeof rawUser === 'object') {
          const { token: _t, refreshToken: _r, accessToken: _a, ...rest } = rawUser as any;
          user = rest;
        }

        // store authUser object for APIClient to pick up (it reads sessionStorage.authUser)
        const authUserObj: any = { token, refreshToken, user };
        sessionStorage.setItem("authUser", JSON.stringify(authUserObj));
        // Ensure axios default Authorization header is set for subsequent requests
        if (token) {
          setAuthorization(token);
          dispatch(loginSuccess(user));
          history('/dashboard');
        } else {
          // If backend didn't return a token, still try to login using returned user
          if (user) {
            dispatch(loginSuccess(user));
            history('/dashboard');
          } else {
            dispatch(apiError(data));
          }
        }
      } else {
        // jwt or firebase (default) behavior
        sessionStorage.setItem("authUser", JSON.stringify(data));
        dispatch(loginSuccess(data));
        history('/dashboard');
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch : any) => {
  try {
    let fireBaseBackend : any = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      // clear session and dispatch
      sessionStorage.removeItem("authUser");
      // remove axios auth header
      try { delete axios.defaults.headers.common['Authorization']; } catch (e) {}
      dispatch(logoutUserSuccess(response));
      return;
    }

    // If using backend auth, call logout endpoint with refreshToken if available
    if (process.env.REACT_APP_DEFAULTAUTH === 'backend') {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // call the statically-imported helper
          await postBackendLogout({ refreshToken });
        } catch (err) {
          // don't block logout if API call fails
          console.warn('Logout API call failed', err);
        }
      }
    }

    // default cleanup for jwt/fake/backend
    sessionStorage.removeItem("authUser");
    try { delete axios.defaults.headers.common['Authorization']; } catch (e) {}
    dispatch(logoutUserSuccess(true));

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type : any, history : any) => async (dispatch : any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend : any = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
      //   response = postSocialLogin(data);
      // }
      
      const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch : any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};