import React from "react";

const Notification = ({ message, warning }) => {
  const notificationStyle = {
    color: warning ? "red" : "green",
    backgroundColor: "lightgrey",
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return message === "" ? (
    <></>
  ) : (
    <div style={notificationStyle}>{message}</div>
  );
};

export default Notification;
