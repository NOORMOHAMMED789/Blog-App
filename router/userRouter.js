const express = require("express");
const router = express.Router();
const User = require("../modal/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "noormohammed@789";

router.use(express.json());

router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        status: "Failed",
        message: "Account already exists",
      });
    }

    const hashed_password = await bcrypt.hash(req.body.password, saltRounds);

    const new_user = {
      email: req.body.email,
      password: hashed_password,
    };

    const response = await User.create(new_user);
    res.status(201).json({
      status: "Success",
      message: "register successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Account not found, Please Register",
      });
    }
    const response = bcrypt.compare(password, user.password);
    if (response) {
      const token = jwt.sign(
        {
          data: user.email,
        },
        PRIVATE_KEY,
        { expiresIn: "1h" }
      );
      return res.json({
        status: "Success",
        token: token,
        name: user.name,
      });
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid credentails",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});

module.exports = router;
