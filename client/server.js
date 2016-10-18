const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set('debug', true) 
mongoose.connect('mongodb://localhost/pizza')

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

let Post = mongoose.model('Post', postSchema)
// let Post = require('../models/instagram-post.js')

// console.log(Post)
app.set('view engine', 'ejs')

app.use(express.static('public'));

app.get('/', (req, res) => {
  // getting posts objects
  Post
    .find({ isPizza: true })
    .sort({ score: -1 })
    .exec((err, posts) => {
      if (err) throw err
      // for (let post of posts)
      // console.log(posts)
      res.render('index.ejs', { posts })
    })

})

app.get('/posts', (req, res) => {
   Post
    .find({ isPizza: true })
    .sort({ score: -1 })
    .exec((err, posts) => {
      if (err) throw err
      console.log(posts.length)
      res.json(posts)
    })
})

app.listen(3000, () => console.log('Magic at http://localhost:3000'))