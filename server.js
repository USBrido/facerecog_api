const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const pg = require('pg');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'rodrigosilva',
    password : '',
    database : 'user-database'
  }
});


const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: '12345',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: '12345',
      entries: 0,
      joined: new Date()
    }
  ]
};
 
app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  // // Load hash from your password DB.
  // bcrypt.compare("bacon", hash, function(err, res) {
  //   // res == true
  // });
  // bcrypt.compare("veggies", hash, function(err, res) {
  //   // res = false
  // });
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error log ging in');
  }
});

app.post('/register',(req, res) => {
  
  const {email, name, password} = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(error => res.status(400).json('Unable to register'));
  
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .where({id})
    .from('users')
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(error => res.status(400).json('Error retrieving user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db.where('id', '=', id)
    .from('users')
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json('Error retrieving entries'));
});

app.listen(3000, () => {
  console.log('App is running');
});