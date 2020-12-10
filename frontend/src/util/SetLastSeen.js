import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function SetLastSeen() {
  const { authenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (authenticated) {
      setInterval(() => {
        axios.post("/user/status");
        clearInterval();
      }, 100000);
      axios.post("/user/status");
    }
  }, []);
  return null;
}

export default SetLastSeen;
