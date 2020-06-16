const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const pg = require("pg");
const signin = require("./controllers/signin");
const register = require("./controllers/register");

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

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post("/register", (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .where({ id })
    .from("users")
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(error => res.status(400).json("Error retrieving user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db.where("id", "=", id)
    .from("users")
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json("Error retrieving entries"));
});

app.listen(3000, () => {
  console.log("App is running");
});
