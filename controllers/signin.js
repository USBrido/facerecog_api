
const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleSignin: handleSignin
};