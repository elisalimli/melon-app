import { SET_ERRORS, CLEAR_ERRORS, LOADING_UI, LOADING_FALSE } from "../types";

const initialState = {
  loading: false,
  errors: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {},
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
