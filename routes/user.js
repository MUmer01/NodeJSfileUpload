const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../multer");

const verifyToken = (req, res, next) => {
  // FORMAT OF TOKEN
  // Authorization: Bearer <access_token>
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.includes("Bearer ")) {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.status(403);
    res.send({ message: "Authorization token is missing or invalid!" });
  }
};

const users = [];
const posts = [];

router.post("/add", upload.single("image"), (req, res) => {
  let newID = 1;
  const len = users.length;
  if (len) {
    const lastUser = users[len - 1];
    newID = lastUser.id + 1;
  }
  console.log(req.body);
  const newUser = {
    id: newID,
    name: req.body.name,
    email: req.body.email,
    image: req.file.path,
  };

  jwt.sign(
    { user: newUser },
    `secretkey`,
    { expiresIn: "24h" },
    (error, token) => {
      if (error) {
        res.status(400).send("Something went wrong");
      } else {
        users.push(newUser);
        res.statusCode = 201;
        res.contentType("application/json");
        res.send(
          JSON.stringify({
            token,
            user: newUser,
          })
        );
      }
    }
  );
});

router.get("/get", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (error, tokenData) => {
    if (error) {
      res.status(403).send("Invalid Token");
    } else {
      const id = tokenData.user.id;
      const currentUser = users.find((user) => user.id == id);
      if (currentUser) {
        res.contentType("application/json");
        res.status(200).send(JSON.stringify(currentUser));
      } else {
        res.status(404).send("User not found!");
      }
    }
  });
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
