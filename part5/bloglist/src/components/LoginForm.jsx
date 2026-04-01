// Exercise 5.1: Login form
const LoginForm = ({ username, password, onUsernameChange, onPasswordChange, onSubmit }) => (
  <div>
    <h2>log in to application</h2>
    <form onSubmit={onSubmit}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={onUsernameChange}
          name="username"
          data-testid="username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={onPasswordChange}
          name="password"
          data-testid="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

export default LoginForm
