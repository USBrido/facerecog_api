const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: 'e2c6184910e14da5ba9b7ed7ec42a0ad'
});

const handleApiCall = (req,res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(error => res.status(400).json('Unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db.where("id", "=", id)
    .from("users")
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json("Error retrieving entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};