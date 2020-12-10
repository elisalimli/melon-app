import React, { Fragment } from "react";
import NoImg from "../images/no-img.png";
//MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    marginBottom: 20,
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25,
  },
  cover: {
    minWidth: 200,
    objectFit: "cover",
  },
  handle: {
    width: 60,
    height: 18,
    background: theme.palette.primary.main,
    marginBottom: 7,
    borderRadius: 2,
  },
  date: {
    height: 14,
    width: 100,
    background: "rgba(0,0,0,0.2)",
    marginBottom: 10,
  },
  fullLine: {
    height: 15,
    background: "rgba(0,0,0,0.6)",
    width: "90%",
    marginBottom: 10,
  },
  halfLine: {
    height: 15,
    background: "rgba(0,0,0,0.6)",
    width: "50%",
    marginBottom: 10,
  },
}));

function ScreamSkeleton() {
  const classes = useStyles();

  const content = Array.from({ length: 5 }).map((item, index) => (
    <Card className={classes.card} key={index}>
      <img className={classes.cover} src={NoImg} alt="" width="100" />
      <CardContent className={classes.cardContent}>
        <div className={classes.handle}></div>
        <div className={classes.date}></div>
        <div className={classes.fullLine}></div>
        <div className={classes.fullLine}></div>
        <div className={classes.halfLine}></div>
      </CardContent>
    </Card>
  ));

  return <Fragment>{content}</Fragment>;
}

export default ScreamSkeleton;
