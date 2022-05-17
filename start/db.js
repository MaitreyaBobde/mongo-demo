const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("connected to mongoDB..."))
    .catch((err) => console.log("error connecting to mongoDB..."));
};
