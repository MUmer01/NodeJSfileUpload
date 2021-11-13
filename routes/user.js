const express = require("express");
const router = express.Router();
const upload = require("../multer");

const users = [];

router.post("/add", upload.single("image"), (req, res) => {
  let newID = 1;
  const len = users.length;
  if (len) {
    const lastUser = users[len - 1];
    newID = lastUser.id + 1;
  }
  const newUser = {
    id: newID,
    name: req.body.name,
    email: req.body.email,
    image: req.file.path,
  };
  users.push(newUser);
  res.statusCode = 201;
  res.contentType("application/json");
  res.send(JSON.stringify(newUser));
});

router.get("/get", (req, res) => {
  const id = req.query.id;
  const currentUser = users.find((user) => user.id == id);
  if (currentUser) {
    res.contentType("application/json");
    res.status(200).send(JSON.stringify(currentUser));
  } else {
    res.status(404).send("User not found!");
  }
});

router.put("/update", (req, res) => {
  const id = req.body.id;
  const userIndex = users.findIndex((user) => user.id == id);
  if (userIndex > -1) {
    if (req.body.name || req.body.email) {
      const currentUser = { ...users[userIndex] };
      if (req.body.name) {
        currentUser.name = req.body.name;
      }
      if (req.body.email) {
        currentUser.email = req.body.email;
      }
      users[userIndex] = currentUser;
      res.contentType("application/json");
      res.status(200).send(JSON.stringify(currentUser));
    } else {
      res.status(400).send(`Invalid API syntax!`);
    }
  } else {
    res.status(404).send(`User Not Found!`);
  }
});

router.delete("/delete", (req, res) => {
  const id = req.query.id;
  const userIndex = users.findIndex((user) => user.id == id);
  if (userIndex > -1) {
    /* const deletedUser = */ users.splice(userIndex, 1);
    res.status(200).send(`User Deleted!`);
  } else {
    res.status(404).send(`User Not Found!`);
  }
});

module.exports = router;
