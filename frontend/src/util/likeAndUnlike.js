import { useSelector, useDispatch } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

export const like = (dispatch, data) => {
  data.likeCount = data.likeCount + 1;
  dispatch(likeScream(data.screamId, data));
};
export const unlike = (dispatch, data) => {
  data.likeCount = data.likeCount - 1;
  dispatch(unlikeScream(data.screamId, data));
};
