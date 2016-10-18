const mongoose = require('mongoose')

// Defining mongoose model
const postSchema = new mongoose.Schema({
  _id: String,
  time: Date,
  text: String,
  media: String,
  cheese: Number,
  crust: Number,
  sauce: Number,
  score: Number,
  adress: String,
  isPizza: Boolean,
  location: String,
  gMapsLocation: {
    lat: Number,
    lng: Number,
    name: String,
    adress: String,
    url: String
  }
})

module.exports = mongoose.model('Post', postSchema)