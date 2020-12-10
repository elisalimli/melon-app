import React, { useEffect, useState } from "react";
import AppIcon from "../../../images/monkey.png";
import styles from "./signup.module.css";
import "../index.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import LinkMUI from "@material-ui/core/Link";
//MUI stuffs
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";

//Redux stuffs
import { useSelector, useDispatch } from "react-redux";
import { signUpUser } from "../../../redux/actions/userActions";
import { CLEAR_ERRORS } from "../../../redux/types";

const Signup = () => {
  let history = useHistory();
  const theme = useTheme();
  //Redux hooks stuffs
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const UI = useSelector((state) => state.UI);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [errors, setErrors] = useState({});
  //Redux
  const loading = UI.loading;
  if (UI.errors !== errors) setErrors(UI.errors);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUserData = {
      email,
      password,
      handle,
      confirmPassword,
    };

    dispatch(signUpUser(newUserData, history));
  };

  useEffect(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);
  return (
    <Grid container className="register-container">
      <Grid item sm></Grid>
      <Grid item sm={6} xs={7} md={3}>
        <div>
          <div className="appIcon">
            <img width="50px" src={AppIcon} alt="Logo" />
          </div>
          <Typography variant="h2" className="pageTitle">
            Signup
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <div className="textFields">
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                className="textField"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                helperText={errors.email}
                error={errors.email ? true : false}
              ></TextField>
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                className="textField"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                helperText={errors.password}
                error={errors.password ? true : false}
              ></TextField>
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                type="confirmPassword"
                label="Confirm Password"
                className="textField"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                helperText={errors.confirmPassword}
                error={errors.confirmPassword ? true : false}
              ></TextField>
              <TextField
                id="handle"
                name="handle"
                type="handle"
                label="Handle"
                className="textField"
                onChange={(e) => setHandle(e.target.value)}
                value={handle}
                helperText={errors.handle}
                error={errors.handle ? true : false}
              ></TextField>
            </div>
            {errors.general && (
              <Typography variant="body2" className="customError">
                {errors.general}
              </Typography>
            )}

            <div className="submitButton">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Signup
                {loading && <CircularProgress className="progress" size={30} />}
              </Button>
            </div>

            <Link to="/login">
              <small style={{ color: theme.palette.linkColor }}>
                Already have an account ? login here
              </small>
            </Link>
          </form>
        </div>
      </Grid>
      <Grid item sm></Grid>
    </Grid>
  );
};

export default Signup;
