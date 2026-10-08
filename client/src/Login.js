import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
        "https://s4p-backend.onrender.com/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "userRole",
        response.data.role || "student"
      );
      localStorage.setItem(
        "username",
        response.data.username
      );

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

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    try {
      const response = await axios.post(
        "https://s4p-backend.onrender.com/auth/forgot-password",
        {
          email,
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to send password reset link"
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
        "https://s4p-backend.onrender.com/auth/register",
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
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-card">

        {isForgotPassword ? (
          <>
            <div className="login-icon">
              🔐
            </div>

            <div className="login-brand">
              <h1>S4P</h1>
              <span>
                Smart Student Skill & Support Platform
              </span>
            </div>

            <div className="login-heading">
              <h2>Forgot Password?</h2>

              <p>
                Enter your registered email and we'll send
                you a password reset link.
              </p>
            </div>

            <div className="login-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <button
              className="login-main-button"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>

            <div className="login-switch">
              <button
                onClick={() =>
                  setIsForgotPassword(false)
                }
              >
                Back to Login
              </button>
            </div>

            <div className="login-footer">
              Smart Education • S4P
            </div>
          </>
        ) : (
          <>
            <div className="login-icon">
              🎓
            </div>

            <div className="login-brand">
              <h1>S4P</h1>
              <span>
                Smart Student Skill & Support Platform
              </span>
            </div>

            <div className="login-heading">
              <h2>
                {isRegistering
                  ? "Create Your Account"
                  : "Welcome Back"}
              </h2>

              <p>
                {isRegistering
                  ? "Join S4P and start building your career roadmap."
                  : "Track your skills, goals and learning journey."}
              </p>
            </div>

            {isRegistering && (
              <div className="login-field">
                <label>Username</label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </div>
            )}

            <div className="login-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {isRegistering && role === "student" && (
              <div className="login-field">
                <label>Course</label>

                <input
                  type="text"
                  placeholder="Enter your course"
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                />
              </div>
            )}

            <div className="login-field">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {!isRegistering && (
              <div className="login-switch">
                <button
                  onClick={() =>
                    setIsForgotPassword(true)
                  }
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {isRegistering && (
              <div className="login-field">
                <label>Account Type</label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="teacher">
                    Faculty / Mentor
                  </option>
                </select>
              </div>
            )}

            <button
              className="login-main-button"
              onClick={
                isRegistering
                  ? handleRegister
                  : handleLogin
              }
            >
              {isRegistering
                ? "Create Account"
                : "Login"}
            </button>

            <div className="login-switch">
              <span>
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                onClick={() =>
                  setIsRegistering(!isRegistering)
                }
              >
                {isRegistering
                  ? "Back to Login"
                  : "Create Account"}
              </button>
            </div>

            <div className="login-footer">
              Smart Education • S4P
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;