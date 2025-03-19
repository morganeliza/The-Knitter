import { useState} from "react";
import { getUserById } from "../db";

export default function Login(props) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const userlogin = { username, password };
    const response = await loginUser(userlogin);
    const token = localStorage.setItem("token", response.token);
    props.setToken(token);

    
  }

  return (
    <>
      <div className="login">
        <div>
          <form onSubmit={handleSubmit}>
            <input
              value={email}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="submit" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
