import React, { useState, useEffect, Fragment } from "react";
//3rd party packages
import { Link, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//Mui stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
//Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
//
import { useSelector, useDispatch } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/dataActions";

function Notifications() {
  let notificationsIcon;
  const [state, setState] = useState({ anchorEl: null });
  const history = useHistory();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);

  dayjs.extend(relativeTime);

  //Handlers
  const handleOpen = (e) => {
    history.push(`/`);

    setState({ ...state, anchorEl: e.target });
  };
  const handleClose = () => setState({ ...state, anchorEl: null });
  const onMenuOpen = () => {
    let unreadNotificationsIds = notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    if (unreadNotificationsIds.length > 0)
      dispatch(markNotificationsRead(unreadNotificationsIds));
  };

  //Notifications Icon
  if (notifications && notifications.length > 0) {
    notifications.filter((not) => not.read === false).length > 0
      ? (notificationsIcon = (
          <Badge
            badgeContent={
              notifications.filter((not) => not.read === false).length
            }
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        ))
      : (notificationsIcon = <NotificationsIcon />);
  } else notificationsIcon = <NotificationsIcon />;

  //Notifications MarkUp
  let notificationsMarkUp =
    notifications && notifications.length > 0 ? (
      notifications.map((not, index) => {
        const verb = not.type === "like" ? "liked" : "commented on";
        const time = dayjs(not.createdAt).fromNow();
        const iconColor = not.read ? "primary" : "secondary";
        const icon =
          not.type === "like" ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );
        return (
          <Link
            key={index}
            to={`/users/${not.recipient}/scream/${not.screamId}`}
            className="link"
          >
            <MenuItem onClick={handleClose}>
              {icon}
              <Typography variant="body1" style={{ marginRight: 10 }}>
                {not.sender} {verb} your scream
              </Typography>
              <Typography color="textSecondary"> {time}</Typography>
            </MenuItem>
          </Link>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>
        You don't have any notifications yet.
      </MenuItem>
    );

  return (
    <Fragment>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={state.anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={state.anchorEl}
        open={Boolean(state.anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpen}
      >
        {notificationsMarkUp}
      </Menu>
    </Fragment>
  );
}

export default Notifications;
