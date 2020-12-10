import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
//Components
import Scream from "../components/Scream/Scream";
import StaticProfile from "../components/Profile/StaticProfile";
import ScreamSkeleton from "../util/ScreamSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
//Mui
import Grid from "@material-ui/core/Grid";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
import { selectedUserData } from "../redux/actions/userActions";
function User() {
  const dispatch = useDispatch();
  const { handle, screamIdURL } = useParams();
  const { userScreams, loading } = useSelector((state) => state.data);
  const { selectedUser } = useSelector((state) => state.user);
  const [state, setState] = useState({
    profile: null,
    screams: false,
    screamIdParam: null,
  });

  //Set screams of user
  useEffect(() => {
    if (userScreams !== state.screams)
      setState({ ...state, screams: userScreams });
  }, [userScreams]);

  useEffect(() => {
    setState({ ...state, profile: selectedUser });
  }, [selectedUser]);

  //Get user data
  useEffect(() => {
    dispatch(getUserData(handle));
    dispatch(selectedUserData(handle));
  }, []);

  const screamsMarkUp = loading ? (
    <ScreamSkeleton />
  ) : userScreams === null ? (
    <p>No screams from this user</p>
  ) : !screamIdURL ? (
    userScreams.map((scream) => (
      <Scream key={scream.screamId} scream={scream} />
    ))
  ) : (
    userScreams.map((scream) => {
      if (scream.screamId !== screamIdURL) {
        scream.openDialog = false;
        return <Scream key={scream.screamId} scream={scream} />;
      } else {
        scream.openDialog = true;
        return <Scream key={scream.screamId} scream={scream} />;
      }
    })
  );

  return (
    <Grid container>
      <Grid item md={8} sm={12} xs={12}>
        {screamsMarkUp}
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        {state.profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={state.profile} />
        )}
      </Grid>
    </Grid>
  );
}

export default User;
