const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

const User = require("../models/user");
const { UserAuth } = require("../models/userAuth");

router.get("/", async (req, res) => {
  const users = await User.find({}, "-_id -__v").sort("name");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.userID, "-_id -__v");
  const userAuth = await UserAuth.findById(req.user._id, "-_id -__v -password");
  if (!user) {
    return res.status(400).send("user with given id does not exist.");
  }
  res.send({ ...userAuth._doc, ...user._doc });
});

router.get("/:id", async (req, res) => {
  const userID = req.params.id;
  const user = await User.findById(userID, "-_id -__v");
  if (!user) {
    return res.status(400).send("user with given id does not exist.");
  }
  res.send(user);
});

router.put("/me", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.userID,
    {
      name: req.body.name,
      dateOfBirth: new Date(req.body.dateOfBirth),
      occupation: req.body.occupation,
      company: req.body.company,
      address: {
        hno: req.body.address?.hno,
        street: req.body.address?.street,
        city: req.body.address?.city,
        state: req.body.address?.state,
      },
    },
    { new: true }
  );

  if (!user)
    return res
      .status(404)
      .send("Seems Like the user does not exist please register first.");

  res.send(user);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      dateOfBirth: new Date(req.body.dateOfBirth),
      occupation: req.body.occupation,
      company: req.body.company,
      address: {
        hno: req.body.address?.hno,
        street: req.body.address?.street,
        city: req.body.address?.city,
        state: req.body.address?.state,
      },
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found");

  res.send(user);
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.user.userID);

  if (!user)
    return res
      .status(404)
      .send("Seems Like the user does not exist please register first.");
  await UserAuth.remove({ userID: req.user.userID });

  res.send(user);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found");
  await UserAuth.remove({ userID: req.user.userID });

  res.send(user);
});

module.exports = router;
