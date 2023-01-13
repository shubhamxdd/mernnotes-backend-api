const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require("express-validator");
const router = express.Router();

const jwt_secret = "mainahibataunga";

// create user using POST request at "/api/auth/createuser" endpoint
router.post(
  "/createuser",
  [
    body("name", "Enter a name of 5 length").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password", "Enter a password of 5 length").isLength({ min: 2 }),
  ],
  async (req, res) => {
    // if err send err
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, this email is already taken" });
      }

      const salt = await bcrypt.genSalt(10);
      const encPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, jwt_secret);
      console.log(authToken);

      res.json({ authToken });
      // res.json(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured :(");
    }

    // console.log(user);
  }
);

// user auth at "/api/auth/login" endpoint

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "Password cannot be null").exists(),
  ],
  async (req, res) => {
    // if err send err
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        // user doesnt exist
        return res
          .status(400)
          .json({ error: "Please login again with correct details" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        // password doesnt match
        return res
          .status(400)
          .json({ error: "Please login again with correct details" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, jwt_secret);
      console.log(authToken);

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured :(");
    }
  }
);

// get logged in user details at "/api/auth/getuser" endpoint

router.post("/getuser", fetchuser,async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occured :(");
  }
});

module.exports = router;
