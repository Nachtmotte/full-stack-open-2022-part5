import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, warning }) => {
  const notificationStyle = {
    color: warning ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return message === '' ? (
    <></>
  ) : (
    <div style={notificationStyle}>{message}</div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  warning: PropTypes.bool.isRequired,
}

export default Notification
