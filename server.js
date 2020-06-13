const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const pg = require("pg");

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

app.post("/signin", (req, res) => {

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data=> {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            console.log(user);
            res.json(user[0]);
          })
          .catch(error =>res.status(400).json('unable to retrieve user'));
      } else {
        res.status(400).json('Name and Password combination are not correct');
      }
    })
    .catch(error =>res.status(400).json('unable to login-in'));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .catch(error => res.status(400).json("Unable to register"));
});

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
