import {
  SET_SCREAMS,
  SET_USER_SCREAMS,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_DATA,
  LOADING_UI,
  LOADING_FALSE,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
  MARK_NOTIFICATIONS_READ,
} from "../types";
import axios from "axios";

//Get all screams
export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/screams")
    .then((res) => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};
//Get only one scream
export const getScream = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({ type: SET_SCREAM, payload: res.data });
      dispatch(setLoadingFalse());
    })
    .catch((err) => console.error(err));
};

//Like a scream
export const likeScream = (screamId, data) => async (dispatch) => {
  axios.get(`/scream/${screamId}/like`).catch((err) => console.error(err));
  dispatch({ type: LIKE_SCREAM, payload: data });
};
//Unlike a scream
export const unlikeScream = (screamId, data) => async (dispatch) => {
  axios.get(`/scream/${screamId}/unlike`).catch((err) => console.error(err));
  dispatch({ type: UNLIKE_SCREAM, payload: data });
};
//Submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//Delete a scream
export const deleteScream = (screamId) => (dispatch) => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch((err) => console.log(err));
};

//Post a scream
export const postScream = (body, formData) => (dispatch) => {
  let data;
  let imageURL = "";
  dispatch({ type: LOADING_UI });
  axios
    .post("/scream", { body: body })
    .then((res) => {
      data = res.data;

      if (formData !== false) {
        return axios
          .post(`/scream/${res.data.screamId}/image`, formData)
          .then((res) => (imageURL = res.data.message));
      } else {
        dispatch(setLoadingFalse());
      }
    })
    .then((res) => {
      data.postImageURL = imageURL;
      dispatch({ type: POST_SCREAM, payload: data });

      dispatch(clearErrors());
      dispatch(setLoadingFalse());
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const setLoadingFalse = () => (dispatch) => {
  dispatch({ type: LOADING_FALSE });
};

export const getUserData = (handle) => async (dispatch) => {
  axios
    .get(`/user/${handle}`)
    .then((res) => {
      dispatch({ type: SET_USER_SCREAMS, payload: res.data.screams });
    })
    .catch((err) => dispatch({ type: SET_USER_SCREAMS, payload: null }));
};

export const markNotificationsRead = (notificationsIds) => (dispatch) => {
  axios
    .post("/notifications", notificationsIds)
    .then((res) => {
      dispatch({ type: MARK_NOTIFICATIONS_READ });
    })
    .catch((err) => console.error(err));
};
