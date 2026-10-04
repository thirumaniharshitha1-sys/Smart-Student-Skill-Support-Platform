import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.3:5000/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");

      onLogin();
    } catch (error) {
      alert("Invalid Email or Password");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Student Portal Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button
        className="register-btn"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;