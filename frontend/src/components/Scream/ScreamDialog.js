import React, { useEffect, useState, Fragment } from "react";
import dayjs from "dayjs";
import { Link, useHistory } from "react-router-dom";
//Components
import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comment/Comments";
import CommentForm from "./Comment/CommentForm";
import likedScream from "../../util/likedScream";
import { like, unlike } from "../../util/likeAndUnlike";
//MUI stuff
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
//Icons
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";
//Redux stuff
import { useSelector, useDispatch } from "react-redux";
import { getScream } from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  ...theme.classes,

  profileImage: {
    width: 50,
    borderRadius: "50%",
  },
  closeButton: {
    position: "absolute",
    right: "10px",
  },
  userBody: {
    marginBottom: 5,
  },
  userName: {
    marginRight: "5px",
    display: "inline-block",
    fontWeight: 600,
    color: "black",
  },
  expandButton: {
    position: "absolute",
    right: "-6%",
  },
}));

const ScreamDialog = ({ scream, openDialog }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.UI);
  const user = useSelector((state) => state.user);
  //
  const [state, setState] = useState({
    open: false,
    oldPath: "",
    newPath: "",
  });

  const {
    body,
    createdAt,
    likeCount,
    commentCount,
    userImage,
    postImageURL,
    lastSeenAt,
    comments,
    userHandle,
    screamId,
  } = scream;

  const handleOpen = () => {
    let oldPath = window.location.pathname;
    console.log(oldPath);

    const newPath = `/users/${userHandle}/scream/${screamId}`;

    if (oldPath === newPath) oldPath = `/users/${userHandle}`;

    window.history.pushState(null, null, newPath);
    dispatch(getScream(screamId));
    setState({ ...state, open: true, oldPath, newPath });
  };

  useEffect(() => {
    if (scream.openDialog === true) handleOpen();
  }, []);

  const handleClose = () => {
    history.push(`/users/${userHandle}`);

    setState({ ...state, open: false });
  };

  const dialogMarkUp = loading ? (
    <div className={classes.flexCenter}>
      <CircularProgress size={40} style={{ height: "100%" }} />
    </div>
  ) : (
    <Fragment>
      <CardHeader
        style={{ padding: "10px 0 5px 0" }}
        avatar={
          <div style={{ position: "relative" }}>
            <img alt="Profile pic" src={userImage} className={classes.avatar} />
            <div
              className={
                user.credentials.handle === userHandle
                  ? classes.online
                  : Date.now() - lastSeenAt < 100000
                  ? classes.online
                  : classes.offline
              }
            ></div>
          </div>
        }
        title={
          <Typography
            color="primary"
            style={{ fontSize: "22px" }}
            component={Link}
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a,MMMM DD YYYY")}
          </Typography>
        }
      />

      {postImageURL ? (
        <img
          src={postImageURL}
          className={classes.postImage}
          style={{ width: "100%" }}
          alt="Post pic"
          onDoubleClick={() => {
            if (user.authenticated) {
              if (likedScream(user, screamId)) {
                unlike(dispatch, scream);
              } else {
                like(dispatch, scream);
              }
            }
          }}
        />
      ) : null}
      <div style={{ marginLeft: 10 }}>
        <div className="likesComments">
          <LikeButton data={scream} />
          <span className={classes.likeCount}> {likeCount} Likes</span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
        </div>
        <Typography body="body1" className={classes.userBody}>
          <Link to={`/users/${userHandle}`} className={classes.userName}>
            {userHandle}
          </Link>
          {body.split(" ").map((item) => {
            let mentions = [];
            if (item[0] == "@") {
              mentions.push(item);
              if (item.includes(",")) {
                mentions = [];
                mentions = item.split(",");
              }

              return mentions.map((item, index) => (
                <Typography
                  key={index}
                  color="primary"
                  component={Link}
                  to={`/users/${item.substring(1, item.length)}`}
                >
                  {item + " "}
                </Typography>
              ));
            } else {
              return item + " ";
            }
          })}
        </Typography>
      </div>
      {comments && (
        <Fragment>
          <hr className={classes.invisibleSeperator2} />
          <hr className={classes.visibleSeperator} />
        </Fragment>
      )}
      <hr className={classes.invisibleSeperator2} />

      <CommentForm screamId={screamId} />
      <Comments comments={comments} />
    </Fragment>
  );

  return (
    <Fragment>
      <MyButton
        onClick={handleOpen}
        tip="Expand screame"
        btnClassName={classes.expandButton}
      >
        <UnfoldMore color="primary" />
      </MyButton>
      <Dialog open={state.open} onClose={handleClose} fullWidth maxWidth="sm">
        <MyButton
          btnClassName={classes.closeButton}
          tip="Close"
          onClick={handleClose}
        >
          <CloseIcon />
        </MyButton>

        <DialogContent className={classes.dialogContent}>
          {dialogMarkUp}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ScreamDialog;
