import React, { useEffect, useState, Fragment } from "react";
//MUI stuff
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";

//Icons
import EditIcon from "@material-ui/icons/Edit";
//Redux
import { editUserDetails } from "../../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  button: {
    float: "right",
  },
  textField: {
    marginBottom: 25,
  },
}));

function EditDetails() {
  const classes = useStyles();
  const userCredentials = useSelector((state) => state.user.credentials);
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    bio: "",
    website: "",
    location: "",
    open: false,
  });

  const mapUserDetailsToState = () => {
    setCredentials({
      bio: userCredentials.bio ? userCredentials.bio : "",
      website: userCredentials.website ? userCredentials.website : "",
      location: userCredentials.location ? userCredentials.location : "",
      open: false,
    });
  };
  useEffect(() => {
    mapUserDetailsToState();
  }, []);

  //Handlers
  const handleOpen = () => {
    setCredentials({ ...credentials, open: true });
  };
  const handleClose = () => {
    setCredentials({ ...credentials, open: false });
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    console.log(e.target.name);
  };

  const handleSubmit = () => {
    const userDetails = {
      bio: credentials.bio,
      website: credentials.website,
      location: credentials.location,
    };
    dispatch(editUserDetails(userDetails));
    handleClose();
  };

  return (
    <Fragment>
      <IconButton
        // style={{ float: "right" }}
        onClick={handleOpen}
        className={classes.button}
      >
        <Tooltip title="Edit details" placement="top" arrow>
          <EditIcon color="primary" />
        </Tooltip>
      </IconButton>
      <Dialog
        open={credentials.open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <TextField
            name="bio"
            type="text"
            label="Bio"
            multiline
            placeholder="A short bio about yourself"
            className={classes.textField}
            value={credentials.bio}
            onChange={handleChange}
            fullWidth
          ></TextField>{" "}
          <TextField
            name="website"
            type="text"
            label="Website"
            rows="3"
            placeholder="Your personal/professinal website"
            className={classes.textField}
            value={credentials.website}
            onChange={handleChange}
            fullWidth
          ></TextField>{" "}
          <TextField
            name="location"
            type="text"
            label="Location"
            rows="3"
            placeholder="Where you live"
            className={classes.textField}
            value={credentials.location}
            onChange={handleChange}
            fullWidth
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>{" "}
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default EditDetails;
