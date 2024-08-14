const Notification = ({ notification }) => {

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const successStyle = {
    ...notificationStyle,
    color: 'green',
  }

  const errorStyle = {
    ...notificationStyle,
    color: 'red',
  }

  if (notification === null) {
    return null
  }

  if (notification.type === 'success') {
    return <div style={successStyle}>
      {notification.message}
    </div>
  }
  else if (notification.type === 'error'){
    return <div style={errorStyle}>
      {notification.message}
    </div>
  }

}

export default Notification