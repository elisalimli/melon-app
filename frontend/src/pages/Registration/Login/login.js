import React, { useState, useEffect } from "react";
import AppIcon from "../../../images/monkey.png";
import "../index.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
//MUI stuffs
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
//Redux stuffs
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../../redux/actions/userActions";
import { CLEAR_ERRORS } from "../../../redux/types";
const Login = () => {
  const theme = useTheme();

  let history = useHistory();
  const dispatch = useDispatch();
  const UI = useSelector((state) => state.UI);

  const loading = UI.loading;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  if (UI.errors !== errors) setErrors(UI.errors);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    dispatch(loginUser(userData, history));
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
          <div>
            <Typography variant="h2" className="pageTitle">
              Login
            </Typography>
            <form noValidate onSubmit={handleSubmit}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                className="textField"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                fullWidth
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
                fullWidth
              ></TextField>
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
                  Login
                  {loading && (
                    <CircularProgress className="progress" size={30} />
                  )}
                </Button>
              </div>
              <Link to="/signup">
                <small style={{ color: theme.palette.linkColor }}>
                  Don't have an account ? signup here
                </small>
              </Link>
            </form>
          </div>
        </div>{" "}
      </Grid>
      <Grid item sm></Grid>
    </Grid>
  );
};

export default Login;
