const express = require("express");
const app = express();
const user = require("./routes/user");
app.use(express.json());

const port = 5000;

// Middleware
app.use((req, res, next) => {
  console.log("method " + req.method + " to " + req.url);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `http://localhost:${port}`);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/uploads", express.static("uploads"));

// https://digitalocean.cdn.prismic.io/digitalocean/8d8bc1f0-2a4b-473b-9793-2a240ea8ccb4_digitalocean-logo-mark-copy.svg
// http:localhost:5000/uploads/1636284820608-49550872-favicon-32x32.png
app.use("/user", user);

app.get("/", (req, res) => {
  res.statusCode = 201;
  res.send("Hello World!");
});

app.get("/*", (req, res) => {
  res.statusCode = 404;
  res.send("Not found!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
