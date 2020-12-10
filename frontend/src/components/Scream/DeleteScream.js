import React, { Fragment, useState } from "react";
//Mui Stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
//Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";
//Redux stuff
import { useSelector, useDispatch } from "react-redux";
import { deleteScream } from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";

const useStyles = makeStyles({
  deleteButton: {
    position: "absolute",
    right: "2.5%",
    top: "1.5%",
  },
});
function DeleteScream({ screamId }) {
  const classes = useStyles();
  //Redux
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    console.log(screamId);
    dispatch(deleteScream(screamId));
    setOpen(false);
  };
  return (
    <Fragment>
      <MyButton
        tip="Delete Scream"
        onClick={handleOpen}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="secondary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure want delete this scream?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default DeleteScream;
