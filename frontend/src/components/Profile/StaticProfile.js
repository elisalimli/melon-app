import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./profile.module.css";
import ProfileSkeleton from "../../util/ProfileSkeleton";
//MUI Stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";
//Icons
import CalendarToday from "@material-ui/icons/CalendarToday";
//Redux stuff
import { useDispatch, useSelector } from "react-redux";

//Components
//END OF THE IMPORTING PACKAGES

const StaticProfile = ({ profile: { createdAt, handle, imageURL } }) => {
  const [averageColor, setAverageColor] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { authenticated, loading } = user;

  let profileMarkup =
    !loading && averageColor !== [] ? (
      authenticated ? (
        <Paper className={styles.profileContainer}>
          <div className={styles.container}>
            <div className={styles.profileImageContainer}>
              <img
                src={imageURL}
                id="profileImg"
                alt="Profile pic"
                style={{
                  border: `4px solid rgb(${averageColor[0]},${averageColor[1]},${averageColor[2]})`,
                  background: `rgb(${averageColor[0]},${averageColor[1]},${averageColor[2]})`,
                }}
              />
            </div>

            <div className={styles.profileDetails}>
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5"
                className={styles.profileLink}
              >
                @<span className={styles.userHandle}>{handle}</span>
              </MuiLink>

              <div className={styles.iconContainer}>
                <CalendarToday color="primary" />
                <span className={styles.iconMargin}>
                  Joined {dayjs(createdAt).format("MMM YYYY")}
                </span>
              </div>
            </div>
          </div>
        </Paper>
      ) : (
        <Paper className={styles.paperContainer}>
          <Alert severity="error">No profile found,plase login again</Alert>

          <div className={styles.buttons}>
            <Button
              className={styles.button}
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );
  return profileMarkup;
};

export default StaticProfile;
