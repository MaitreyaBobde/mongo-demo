module.exports = function (err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(400).send("Given User id is Invalid");
  }
  if (err.name === "ValidationError") {
    let errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).send(errors);
  }
  console.log(err);
  res.status(500).send("Something went wrong");
};
