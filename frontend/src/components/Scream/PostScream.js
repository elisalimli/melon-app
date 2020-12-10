import React, { useEffect, useState, Fragment } from "react";
//Components
import MyButton from "../../util/MyButton";
//MUI stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
//Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import PhotoIcon from "@material-ui/icons/Photo"; //Redux
import { useSelector, useDispatch } from "react-redux";
import { postScream, clearErrors } from "../../redux/actions/dataActions";
import { getAllUsers } from "../../redux/actions/userActions";

const useStyles = makeStyles({
  dialogWrapper: {
    padding: "12.5px 12.5px 12.5px 2.5px",
  },
  submitButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  progressSpiner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "2%",
  },
  photoIcon: {
    padding: "15px 2.5px",
  },
});

const PostScream = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    open: false,
    modalOpen: false,
    loading: false,
    body: "",
    image: "",
  });
  //Redux
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.UI.loading);
  let errors = useSelector((state) => state.UI.errors);
  let { users } = useSelector((state) => state.user);

  useEffect(() => {
    setState({ ...state, loading, errors });
    if (!loading && !errors.body && state.open) {
      handleClose();
      dispatch(clearErrors());
    }
  }, [loading, errors]);

  useEffect(() => setState({ ...state, users }), [users]);

  const handleOpen = () => {
    setState({ ...state, open: true });
  };
  const handleClose = () => {
    if (!loading) {
      setState({ ...state, open: false, modalOpen: false, body: "" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (state.image !== "") {
      formData.append("image", state.image, state.image.name);
      dispatch(postScream(state.body, formData));
    } else {
      dispatch(postScream(state.body, false));
    }
    setState({ ...state, body: "", image: "" });
  };
  const handleChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setState({ ...state, image: e.target.files[0] });
  };
  const handleInputClick = () => {
    document.getElementById("postImageInput").click();
  };

  return (
    <Fragment>
      <MyButton tip="Post a Scream!" onClick={handleOpen}>
        <AddIcon color="primary" />
      </MyButton>
      <Dialog open={state.open} onClose={handleClose} fullWidth maxWidth="sm">
        <div className={classes.closeButton}>
          <MyButton tip="Close" onClick={handleClose}>
            <CloseIcon />
          </MyButton>
        </div>
        <div className={classes.dialogWrapper}>
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                name="body"
                id="body"
                type="text"
                label="Scream"
                multiline
                placeholder="Scream at your follow melons"
                error={errors.body ? true : false}
                helperText={errors.body}
                value={state.body}
                onChange={handleChange}
                fullWidth
              />
              {state.modalOpen && (
                <Fragment>
                  <div className="user-modal">
                    {state.users.map((user, index) => (
                      <Fragment key={index}>
                        <div className="user-modal-name">{user}</div>
                        {index === state.users.length - 1 ? null : (
                          <hr className="visibleSeperator" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
              <input
                type="file"
                name="postImageInput"
                id="postImageInput"
                hidden="hidden"
                onChange={handleImageChange}
              />
              <MyButton
                btnClassName={classes.photoIcon}
                onClick={handleInputClick}
                tip="Add a photo"
              >
                <PhotoIcon />
              </MyButton>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpiner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default PostScream;
