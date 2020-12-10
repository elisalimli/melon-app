import React from "react";
import NoImg from "../images/no-img.png";
//Mui stuff
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import styles from "../components/Profile/profile.module.css";
//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles((theme) => ({
  ...theme.classes,

  handle: {
    height: 20,
    width: 60,
    background: theme.palette.primary.main,
    margin: "0 auto 7px auto",
  },
  fullLine: {
    height: 15,
    background: "rgba(0,0,0,0.6)",
    width: "100%",
    margin: "0 auto 7px auto",
    marginBottom: 10,
  },
  halfLine: {
    height: 15,
    background: "rgba(0,0,0,0.6)",
    width: "50%",
    margin: "0 auto 7px auto",
    marginBottom: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  profileText: {
    marginLeft: 10,
  },
}));

function ProfileSkeleton() {
  const classes = useStyles();
  return (
    <Paper className={styles.container}>
      <div className={classes.profile}>
        <div
          className={`${styles.profileImageContainer} ${classes.marginBottom}`}
        >
          <img
            width="100px"
            src={NoImg}
            alt="Profile pic"
            className="profile-image"
          />
        </div>
        <div className="profile-details">
          <div className={classes.handle}></div>
          <div className={classes.fullLine}></div>
          <div className={classes.fullLine}></div>
          <div className={`${classes.marginBottom} ${classes.flexCenter}`}>
            <LocationOn color="primary" />{" "}
            <span className={classes.profileText}>Location</span>
          </div>
          <div className={`${classes.marginBottom} ${classes.flexCenter}`}>
            <LinkIcon color="primary" />{" "}
            <span className={classes.profileText}>https://website.com</span>
          </div>
          <div className={`${classes.marginBottom} ${classes.flexCenter}`}>
            <CalendarToday color="primary" />{" "}
            <span className={classes.profileText}>Joined date</span>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default ProfileSkeleton;
