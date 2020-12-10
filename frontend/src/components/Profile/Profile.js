import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import { prominent } from "color.js";
import dayjs from "dayjs";
import cx from "classnames";
import styles from "./profile.module.css";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";

//MUI Stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
//Redux stuff
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, logoutUser } from "../../redux/actions/userActions";

//Components
import EditDetails from "./EditDetails";
//END OF THE IMPORTING PACKAGES
const useStyles = makeStyles({});

const Profile = () => {
  const classes = useStyles();
  const [averageColor, setAverageColor] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { credentials, authenticated, loading } = user;
  const { createdAt, handle, imageURL, bio, location, website } = credentials;

  useEffect(() => {
    if (imageURL) {
      prominent(imageURL, { amount: 1 }).then((color) => {
        setAverageColor(color);
      });
    }
  }, [imageURL]);

  //Image handler
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    //send the server
    const formData = new FormData();
    formData.append("image", image, image.name);
    dispatch(uploadImage(formData));
  };
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  //Logout user
  const handleLogout = (_) => {
    dispatch(logoutUser());
  };

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
              <MyButton
                btnClassName={styles.editIcon}
                onClick={handleEditPicture}
                tip="Edit profile picture"
                placement="top"
              >
                <EditIcon color="primary" />
              </MyButton>
              <input
                type="file"
                id="imageInput"
                name="imageInput"
                hidden="hidden"
                onChange={handleImageChange}
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
                @<span>{handle}</span>
              </MuiLink>
              {bio && (
                <div className={cx(styles.marginBottom, styles.bio)}>
                  <Typography variant="body2">{bio}</Typography>
                </div>
              )}
              {location && (
                <div className={cx(styles.marginBottom, styles.iconContainer)}>
                  <LocationOn color="primary" /> <span>{location}</span>
                </div>
              )}
              {website && (
                <div className={cx(styles.marginBottom, styles.iconContainer)}>
                  <LinkIcon color="primary" />
                  <MuiLink
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.iconMargin}> {website} </span>{" "}
                  </MuiLink>
                </div>
              )}
              <div className={styles.iconContainer}>
                <CalendarToday color="primary" />
                <span className={styles.iconMargin}>
                  Joined {dayjs(createdAt).format("MMM YYYY")}
                </span>
              </div>
            </div>
          </div>

          <MyButton tip="Logout" onClick={handleLogout} placement="top">
            <KeyboardReturn color="primary" />
          </MyButton>
          <EditDetails />
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

export default Profile;
