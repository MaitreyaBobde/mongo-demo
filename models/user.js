const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    occupation: {
      type: String,
    },
    company: {
      type: String,
      required: [
        function () {
          return this.occupation;
        },
        "Company is required for given occupation",
      ],
    },
    address: {
      hno: String,
      street: String,
      city: String,
      state: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
