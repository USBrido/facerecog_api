const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const Clarifai = require('clarifai');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "rodrigosilva",
    password: "",
    database: "user-database"
  }
});

app.get("/", (req, res) => res.send('Please register or sign-in'));

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post("/register", (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => profile.handleProfile(res, req, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));
  
app.listen(3000, () => {
  console.log("App is running");
});
