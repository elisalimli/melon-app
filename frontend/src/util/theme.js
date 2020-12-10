export default {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#40CDE8",
      dark: "#008394",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff",
    },
    linkColor: "#33c9dc",
  },
  classes: {
    avatar: {
      width: 46,
      height: 46,
      borderRadius: "50%",
    },
    online: {
      position: "absolute",
      width: 10,
      height: 10,
      bottom: "5px",
      right: "3.5px",
      background: "#11bf14",
      borderRadius: "50%",
    },
    offline: {
      position: "absolute",
      width: 10,
      height: 10,
      bottom: "3px",
      right: "3.5px",
      background: "#D8D6D6",
      borderRadius: "50%",
    },
    postImage: {
      maxWidth: "100%",
      height: "auto",

      borderRadius: 2.5,
      transition: ".3s ease-in-out",

      "&:hover": {
        opacity: "0.9",
      },
    },
    flexCenter: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    likeCount: {
      transform: "translateX(-10px)",
    },
    invisibleSeperator: {
      border: "none",
      margin: 5,
    },
    invisibleSeperator2: {
      border: "none",
      margin: 8,
    },
    visibleSeperator: {
      border: "1px solid rgba(0,0,0,.1)",
      background: "rgba(0,0,0,.1)",
    },
    textField: {
      marginBottom: "10px",
    },
    button: {
      marginBottom: "10px",
    },
  },
};
