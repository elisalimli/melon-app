import {
  SET_SCREAMS,
  SET_USER_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  SET_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SUBMIT_COMMENT,
  MARK_NOTIFICATIONS_READ,
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  userScreams: null,

  comments: [],
  loading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };

    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };
    case SET_USER_SCREAMS: {
      return {
        ...state,
        userScreams: action.payload,
      };
    }
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
        loading: false,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let indexLiked = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[indexLiked] = action.payload;
      return {
        ...state,
      };

    case DELETE_SCREAM:
      let indexDeleted = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      state.screams.splice(indexDeleted, 1);
      return {
        ...state,
      };
    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams],
      };

    case SUBMIT_COMMENT: {
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
        },
      };
    }
    case MARK_NOTIFICATIONS_READ:
      // const newNotifications = state.notifications.forEach(
      //   (notification) => (notification.read = true)
      // );
      return {
        ...state,
      };
    default:
      return state;
  }
}
