const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userAuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userAuthSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      userID: this.userID,
      role: this.role,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "1h" }
  );
  return token;
};

const UserAuth = mongoose.model("UserAuth", userAuthSchema);

function validateUserAuth(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().alphanum().min(5).max(255).required(),
  });

  return schema.validate(user);
}

module.exports.UserAuth = UserAuth;
module.exports.validate = validateUserAuth;
