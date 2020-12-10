import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_SELECTED_USER_PROFILE,
  LOADING_UI,
  LOADING_USER,
  SET_UNAUTHENTICATED,
} from "../types";
import axios from "axios";

//Login
export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);

      dispatch(getUserData());

      axios.post("/user/status");

      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//Sign up
export const signUpUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      axios.post("/user/status");

      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//Logout user
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

//Setting authorization header
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", `Bearer ${token}`);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

//Get user data
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios.get("/user").then((res) => {
    dispatch({ type: SET_USER, payload: res.data });
  });
};

//Uploding image :)
export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then((res) => {
      dispatch(getUserData());
    })
    .catch((err) => console.error(err));
};

//Edit user details
export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.error(err));
};
export const selectedUserData = (handle) => (dispatch) => {
  axios
    .get(`/user/${handle}`)
    .then((res) =>
      dispatch({ type: SET_SELECTED_USER_PROFILE, payload: res.data.user })
    )
    .catch((err) => console.error(err));
};
