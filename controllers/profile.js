const handleProfile = (res, req, db) => {
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
};

module.exports = {
  handleProfile: handleProfile
};