const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const User = require("../models/user");
const { UserAuth, validate } = require("../models/userAuth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userAuth = await UserAuth.findOne({ username: req.body.username });
  if (userAuth)
    return res
      .status(400)
      .send("User with that username is already Registered.");
  userAuth = await UserAuth.findOne({ email: req.body.email });
  if (userAuth)
    return res.status(400).send("User with that email is already Registered.");

  userAuth = new UserAuth(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  userAuth.password = await bcrypt.hash(userAuth.password, salt);

  let user = new User({
    name: "temp_" + req.body.username,
  });
  user = await user.save();
  userAuth.userID = user._id;

  await userAuth.save();

  const token = userAuth.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(userAuth, ["_id", "username", "email", "userID", "role"]));
});

module.exports = router;
