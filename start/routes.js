const express = require("express");
const users = require("../routes/users");
const register = require("../routes/register");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/users/register", register);
  app.use("/users/auth", auth);
  app.use("/users", users);
  app.use(error);
};
