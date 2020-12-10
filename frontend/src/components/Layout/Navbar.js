import React, { Fragment } from "react";
import { Link } from "react-router-dom";
//Components
import MyButton from "../../util/MyButton";
import PostScream from "../Scream/PostScream";
//MUI stuff
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
//Icons
import HomeIcon from "@material-ui/icons/Home";
import Notifications from "./Notifications";
//Redux stuff
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  navbar: {
    [theme.breakpoints.down("xs")]: {
      position: "fixed",
      bottom: "0  ",
      top: "auto",
    },
  },
}));

const Navbar = () => {
  const authenticated = useSelector((state) => state.user.authenticated);
  const classes = useStyles();
  return (
    <AppBar className={authenticated ? classes.navbar : null}>
      <Toolbar className="nav-container">
        {authenticated ? (
          <Fragment>
            <PostScream />

            <Link to="/">
              <MyButton placement="bottom" tip="Home">
                <HomeIcon />
              </MyButton>
            </Link>
            <Notifications />
          </Fragment>
        ) : (
          <Fragment>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign up
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
