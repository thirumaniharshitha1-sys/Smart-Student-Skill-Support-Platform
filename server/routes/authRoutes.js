const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");


 // Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, course } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (role === "student" && !course) {
      return res.status(400).json({
        message: "Please enter your course",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await user.save();

    // Automatically create a Student profile
    // when a student registers for the first time.
    if ((role || "student") === "student") {
      let student = await Student.findOne({
        userEmail: email,
      });

      if (!student) {
        student = await Student.findOne({ email });
      }

      if (student) {
        student.userEmail = email;
        student.name = username;
        student.course = course;
        await student.save();
      } else {
        await Student.create({
          name: username,
          email,
          course,
          userEmail: email,
        });
      }
    }

    res.status(201).json({
      message: "Account and profile created successfully!",
      role: user.role,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      "mysecretkey",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login Successful",
      token,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// Forgot Password
router.post("/forgot-password", async (req, res) => {
  console.log("FORGOT PASSWORD ROUTE CALLED");
  console.log("Forgot password request received");
console.log("Email:", req.body.email);

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const resetToken = require("crypto")
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    const resetLink = `https://s4p-frontend.onrender.com/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "S4P Password Reset",
      html: `
        <h2>S4P Password Reset</h2>

        <p>You requested to reset your S4P password.</p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#1e3a5f;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Please enter a new password",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to reset password",
    });
  }
});

module.exports = router;