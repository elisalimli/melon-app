import React from "react";
import axios from "axios";
import "./App.css";
//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
//MUI stuff
import makeStyles from "@material-ui/core/styles/makeStyles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
//End of the MUI
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Navbar from "./components/Layout/Navbar";
import Home from "./pages/home";
import User from "./pages/user";
import Login from "./pages/Registration/Login/login";
import Signup from "./pages/Registration/Signup/signup";
import themeFile from "./util/theme";
import AuthRoute from "./util/AuthRoute";
import SetLastSeen from "./util/SetLastSeen";
//
const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
  "https://europe-west1-melon-d8ac5.cloudfunctions.net/api";

const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

const useStyles = makeStyles({
  container: {
    maxWidth: "1000px",

    [theme.breakpoints.up("xs")]: {
      margin: "80px auto 0 auto",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "15px auto 0 auto",
    },
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <SetLastSeen />
          <Navbar />

          <div className={classes.container}>
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <Route exact path="/users/:handle" component={User} />
              <Route
                exact
                path="/users/:handle/scream/:screamIdURL"
                component={User}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
