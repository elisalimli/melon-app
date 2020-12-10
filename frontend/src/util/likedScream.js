const likedScream = (user, screamId) => {
  if (user.likes && user.likes.find((like) => like.screamId === screamId))
    return true;
  else return false;
};
export default likedScream;
