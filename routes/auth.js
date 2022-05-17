const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const auth = require("../middleware/auth");
const _ = require("lodash");

const { UserAuth } = require("../models/userAuth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userAuth = await UserAuth.findOne().or([
    { username: req.body.username },
    { email: req.body.email },
  ]);
  if (!userAuth)
    return res.status(400).send("Invalid Username or Email or password");

  const validPassword = await bcrypt.compare(
    req.body.password,
    userAuth.password
  );

  if (!validPassword)
    return res.status(400).send("Invalid Username or Email or password");

  const token = userAuth.generateAuthToken();

  res.send({ token: token });
});

router.put("/", auth, async (req, res) => {
  const { error } = validateForUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userAuth = await UserAuth.findOne({ username: req.body.username });
  if (userAuth)
    return res.status(400).send("User with that username already exists.");
  userAuth = await UserAuth.findOne({ email: req.body.email });
  if (userAuth)
    return res.status(400).send("User with that email already exits.");

  userAuth = await UserAuth.findById(req.user._id);
  const validPassword = await bcrypt.compare(
    req.body.password,
    userAuth.password
  );

  if (!validPassword) return res.status(400).send("Invalid current_password");

  if (req.body.new_password) {
    const salt = await bcrypt.genSalt(10);
    req.body.new_password = await bcrypt.hash(req.body.new_password, salt);
  }
  userAuth = await UserAuth.findByIdAndUpdate(
    req.user._id,
    _.pick(req.body, ["username", "email", "new_password"]),
    { new: true }
  );

  res.send("User Authentication details are updated.");
});

function validate(req) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(5).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().alphanum().min(5).max(255).required(),
  }).or("username", "email");

  return schema.validate(req);
}
function validateForUpdate(req) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(5).max(50),
    email: Joi.string().min(5).max(255).email(),
    new_password: Joi.string().alphanum().min(5).max(255),
    current_password: Joi.string().alphanum().min(5).max(255).required(),
  }).or("username", "email", "new_password");

  return schema.validate(req);
}

module.exports = router;
