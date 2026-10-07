const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");


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

module.exports = router;