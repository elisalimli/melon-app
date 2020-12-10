import React, { Fragment } from "react";
//Other stuffs
import { Link } from "react-router-dom";
import dayjs from "dayjs";
//Mui stuff
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Redux stuff
import { useSelector, useDisptach } from "react-redux";

const useStyles = makeStyles((theme) => ({
  ...theme.classes,
  comment: {
    marginBottom: 15,
  },
  commentImage: {
    maxWidth: "100%",
    height: 50,
    objectFit: "cover",
    borderRadius: "50%",
  },
}));

const Comments = () => {
  const classes = useStyles();
  const comments = useSelector((state) => state.data.scream.comments);
  return (
    <Grid container>
      {comments.map((comment, index) => {
        const { body, createdAt, userImage, userHandle } = comment;
        return (
          <Fragment key={index}>
            <Grid className={classes.comment} item sm={12}>
              <Grid container>
                <Grid style={{ marginRight: 12.5 }} item sm={1}>
                  <img
                    src={userImage}
                    alt="Profile pic"
                    className={classes.commentImage}
                  />
                </Grid>
                <Grid item sm={10}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/users/${userHandle}`}
                      color="primary"
                    >
                      {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format("h:mm a,MMMM DD YYYY")}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body1">{body}</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <hr className={classes.visibleSeperator} />
            )}
          </Fragment>
        );
      })}
    </Grid>
  );
};

export default Comments;
