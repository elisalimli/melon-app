import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Scream from "../components/Scream/Scream";
import Profile from "../components/Profile/Profile";
import ScreamSkeleton from "../util/ScreamSkeleton";

//Redux
import { getScreams } from "../redux/actions/dataActions";
import { useSelector, useDispatch } from "react-redux";
const Home = () => {
  const dispatch = useDispatch();
  const { screams, loading } = useSelector((state) => state.data);
  // const [screams, setScream] = useState(null);

  useEffect(() => {
    dispatch(getScreams());
  }, []);

  let recentScreamsMarkup = !loading ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    <ScreamSkeleton />
  );

  return (
    <div>
      <Grid container>
        <Grid item md={8} sm={12} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
