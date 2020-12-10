import React, { useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//Components
import MyButton from "../../util/MyButton";
import likedScream from "../../util/likedScream";
import { like, unlike } from "../../util/likeAndUnlike";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
import "./Scream.css";
//MUI Stuff
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";

import Typography from "@material-ui/core/Typography";
//Icons
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  ...theme.classes,
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
    minHeight: 125,
    padding: 10,
    maxWidth: "75%",
    margin: "0 auto",
  },

  content: {
    width: "100%",
    padding: "0px 5px 10px 10px",
  },
  body: {},
}));

function Scream({ scream }) {
  const {
    likeCount,
    body,
    commentCount,
    createdAt,
    screamId,
    userHandle,
    userImage,
    postImageURL,
    lastSeenAt,
  } = scream;
  const classes = useStyles();
  //Redux start
  const [collapseText, setCollapseText] = useState(false);
  const [cuttedText, setCuttedText] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  //Get specifies variables
  const handle = user.credentials.handle;
  const authenticated = user.authenticated;
  //Redux end

  dayjs.extend(relativeTime);

  const deleteButton =
    authenticated && userHandle === handle ? (
      <DeleteScream screamId={screamId} />
    ) : null;

  useEffect(() => {
    setCuttedText(body.substring(0, 100));

    if (collapseText === true) {
      setCuttedText(body);
    }
  }, [collapseText, body]);
  return (
    <Card className={classes.card}>
      <CardHeader
        style={{ padding: 5 }}
        avatar={
          <div style={{ position: "relative" }}>
            <img alt="Profile pic" src={userImage} className={classes.avatar} />
            <div
              className={
                handle === userHandle
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
            {userHandle}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
        }
      />
      {postImageURL !== "" && (
        <CardMedia
          image={postImageURL}
          component="img"
          title="Profile image"
          className={classes.postImage}
          onDoubleClick={() => {
            if (authenticated) {
              if (likedScream(user, screamId)) {
                unlike(dispatch, scream);
              } else {
                like(dispatch, scream);
              }
            }
          }}
        ></CardMedia>
      )}
      <CardContent className={classes.content}>
        {deleteButton}
        <div className="likesComments">
          <LikeButton data={scream} />
          <span className={classes.likeCount}> {likeCount} Likes</span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
          <ScreamDialog scream={scream} />
        </div>
        {cuttedText.split(" ").map((item) => {
          let mentions = [];
          if (item[0] === "@") {
            mentions.push(item);
            if (item.includes(",")) {
              mentions = [];
              mentions = item.split(",");
            } else if (item.includes(".")) {
              mentions = [];
              mentions = item.split(".");
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
        {!collapseText && body.length > 100 && (
          <Typography
            component={"span"}
            onClick={() => setCollapseText(true)}
            style={{ cursor: "pointer", marginLeft: 5 }}
            color="textSecondary"
          >
            more...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default Scream;
