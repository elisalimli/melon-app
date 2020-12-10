import React, { useState, Fragment } from "react";
//Mui stuff
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
//Redux stuff
import { useSelector, useDispatch } from "react-redux";
import { submitComment } from "../../../redux/actions/dataActions";
const useStyles = makeStyles((theme) => ({
  ...theme.classes,
  commentButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const CommentForm = ({ screamId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    body: "",
    open: false,
  });
  //Get species variables from redux
  const { authenticated } = useSelector((state) => state.user);
  const { errors } = useSelector((state) => state.UI);

  //Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitComment(screamId, { body: state.body }));
    setState({ ...state, body: "" });
  };
  const handleChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const commentFormMarkUp = authenticated ? (
    <Grid item sm={12} style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          autoComplete="off"
          name="body"
          type="text"
          label="Comment on scream"
          error={errors.comment ? true : false}
          onChange={handleChange}
          fullWidth
          className={classes.textField}
          value={state.body}
          style={{ marginBottom: 20 }}
          onClick={() => setState({ ...state, open: true })}
        />
        {state.open && (
          <div className={classes.commentButtons}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setState({ ...state, open: false })}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </div>
        )}
      </form>
    </Grid>
  ) : null;

  return commentFormMarkUp;
};

export default CommentForm;
