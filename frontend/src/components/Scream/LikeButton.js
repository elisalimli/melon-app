import React from "react";
import { Link } from "react-router-dom";
//Components and styles
import "./Scream.css";
import likedScream from "../../util/likedScream";
import { like, unlike } from "../../util/likeAndUnlike";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { likeScream, unlikeScream } from "../../redux/actions/dataActions";
const LikeButton = ({ data }) => {
  const user = useSelector((state) => state.user);
  const { authenticated, likes } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //Like Scream

  const likeButton = authenticated ? (
    likedScream(user, data.screamId) ? (
      <span
        className="animationHeart"
        onClick={() => unlike(dispatch, data)}
      ></span>
    ) : (
      <span className="heart" onClick={() => like(dispatch, data)}></span>
    )
  ) : (
    <Link to="/login">
      <span className="heart"></span>
    </Link>
  );

  return likeButton;
};

export default LikeButton;
