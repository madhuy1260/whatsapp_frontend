import axios from "axios";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from "../types/authType";

export const userRegister = (formData) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    };
    try {
      const response = await axios.post(
        "/api/messenger/user-register",
        formData,
        config
      );
      localStorage.setItem("authToken", response.data.token);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          successMessage: response.data.successMessage,
          token: response.data.token,
        },
      });
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: { error: error.response.data.error.errorMessage },
      });
    }
  };
};

export const userLogin = (formData) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      console.log(formData);
      const response = await axios.post(
        "/api/messenger/user-login",
        formData,
        config
      );

      localStorage.setItem("authToken", response.data.token);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          successMessage: response.data.successMessage,
          token: response.data.token,
        },
      });
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: { error: error.response.data.error.errorMessage },
      });
    }
  };
};

export const userLogout = () => async (dispatch) => {
  try {
    const response = await axios.post("/api/messenger/user-logout");
    if (response.data.success) {
      localStorage.removeItem("authToken");
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    }
  } catch (e) {}
};
