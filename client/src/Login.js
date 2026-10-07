import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [course, setCourse] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", response.data.role || "student");
    localStorage.setItem("username", response.data.username);

    alert("Login Successful!");

    onLogin(
      response.data.role || "student",
      response.data.username
    );

  } catch (error) {
    console.log(error);
    alert(
      error.response?.data?.message ||
      "Invalid Email or Password"
    );
  }
};
const handleRegister = async () => {
  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/auth/register",
      {
  username,
  email,
  password,
  role,
  course,
}
    );

    alert(response.data.message);

    setIsRegistering(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("student");
    setCourse("");

  } catch (error) {
    console.log(error);
    alert(
      error.response?.data?.message ||
      "Registration failed"
    );
  }
};

 return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #eef3ff, #f8faff, #eef7f5)",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        width: "380px",
        background: "white",
        padding: "35px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(31,45,61,0.12)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "45px", marginBottom: "10px" }}>
        🎓
      </div>

      <h1
        style={{
          color: "#243b53",
          marginBottom: "8px",
        }}
      >
        Smart Student Platform
      </h1>

      <p
        style={{
          color: "#64748b",
          marginBottom: "25px",
        }}
      >
        {isRegistering
          ? "Create your account"
          : "Login to continue"}
      </p>

      {/* Username - Register only */}
      {isRegistering && (
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "15px",
          }}
        />
      )}
      {isRegistering && role === "student" && (
  <input
    type="text"
    placeholder="Enter Course"
    value={course}
    onChange={(e) => setCourse(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "15px",
      marginBottom: "15px",
    }}
  />
)}

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          boxSizing: "border-box",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          fontSize: "15px",
        }}
      />

      <div
  style={{
    position: "relative",
    width: "100%",
    marginBottom: "15px",
  }}
>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 45px 12px 12px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "15px",
    }}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "8px",
      top: "5px",
      background: "transparent",
      color: "#475569",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      margin: 0,
      padding: "6px",
    }}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

      {/* Role - Register only */}
      {isRegistering && (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            boxSizing: "border-box",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "15px",
            background: "white",
          }}
        >
          <option value="student">Student</option>
          <option value="teacher">Faculty / Mentor</option>
        </select>
      )}

      <button
        onClick={
          isRegistering
            ? handleRegister
            : handleLogin
        }
        style={{
          width: "100%",
          padding: "12px",
          background: "#243b53",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {isRegistering ? "Create Account" : "Login"}
      </button>

      <p
        style={{
          marginTop: "20px",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {isRegistering
          ? "Already have an account?"
          : "Don't have an account?"}
      </p>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{
          background: "transparent",
          color: "#2563eb",
          border: "none",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {isRegistering
          ? "Back to Login"
          : "Create Account"}
      </button>
    </div>
  </div>
);
}

export default Login;