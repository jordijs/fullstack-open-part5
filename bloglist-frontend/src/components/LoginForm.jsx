import Notification from './Notification'

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
  notification
}) => (
  <div>
    <h2>Log in to application</h2>
    <Notification notification={notification} />
    <form onSubmit={handleLogin}>
      <div>
        <label>username
          <input
            type="text"
            value={username}
            name="Username"
            autoComplete="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            name="Password"
            autoComplete="current-password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)


export default LoginForm