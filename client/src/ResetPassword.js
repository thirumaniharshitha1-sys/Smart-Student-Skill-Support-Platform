import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = window.location.pathname.split("/").pop();

  const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
      `https://s4p-backend.onrender.com/auth/reset-password/${token}`,
      {
        password: password,
      }
    );

    alert(response.data.message);
    window.location.href = "/";
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Unable to reset password"
    );
  }
};

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-card">

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
          <h2>Reset Password</h2>

          <p>
            Create a new password for your S4P account.
          </p>
        </div>

        <div className="login-field">
          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className="login-field">
          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        <button
          className="login-main-button"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>

        <div className="login-footer">
          Smart Education • S4P
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;