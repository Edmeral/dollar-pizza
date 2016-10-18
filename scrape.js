const InstagramPosts = require('instagram-screen-scrape').InstagramPosts
const request = require('request')
const mongoose = require('mongoose')
const isPizza = require('./vision')
require('dotenv').config()

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

let postsStream = new InstagramPosts({ username: 'dollarpizzaslicenyc' })

mongoose.connect('mongodb://localhost/pizza')

let Post = require('./models/instagram-post')

let counter = 0

postsStream.on('data', post => {
  
  // Getting scores and location
  let match, cheese, crust, sauce, location
  if (match = post.text.match(/Cheese:\s?\d/i))
    cheese = match[0].charAt(match[0].length - 1)
  if (match = post.text.match(/Crust:\s?\d/i))
    crust = match[0].charAt(match[0].length - 1)
  if (match = post.text.match(/Sauce:\s?\d/i))
    sauce = match[0].charAt(match[0].length - 1)
  if (match = post.text.match(/Location:\s?([^\n]*)\n/i))
    location = match[1].trim()

  if (cheese && !location)
    console.log('error: info abut pizza but no info about location')

  let newPost = new Post()

  if (cheese) {
    newPost._id = post.id
    newPost.time = new Date(post.time * 1000)
    newPost.text = post.text
    newPost.media = post.media
    newPost.cheese = cheese
    newPost.crust = crust
    newPost.sauce = sauce
    newPost.score = ((Number(cheese) + Number(crust) + Number(sauce)) / 3).toFixed(2)
    newPost.location = location

    if (newPost.score == 5) { // There is no pizza that has the perfect score
      return
    }

    // Checking if it's a pizza
    isPizza(newPost.media, (err, result) => {
      if (err)
        throw err

      newPost.isPizza = result

      // Getting info about the place from gMaps API
      let gMapsLocation
      let formattedLocation = encodeURIComponent(location.replace(/\(.*\)/, ''))
      let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?' + 
      `query=${formattedLocation}&key=${GOOGLE_PLACES_API_KEY}`

      request(url, (err, res, result) => {
        if (err)
          throw err
        result = JSON.parse(result)
        if (result.results.length == 0) {
          return
        } 
        gMapsLocation = {
          lat: result.results[0].geometry.location.lat,
          lng: result.results[0].geometry.location.lng,
          name: result.results[0].name,
          adress: result.results[0].formatted_address
        }
        
        // getting the place details
        url = 'https://maps.googleapis.com/maps/api/place/details/json?' + 
        `placeid=${result.results[0].place_id}&key=${GOOGLE_PLACES_API_KEY}`
        request(url, (err, res, result) => {
          if (err)
            throw err
          result = JSON.parse(result)
          gMapsLocation.url = result.result.url
          newPost.gMapsLocation = gMapsLocation
          newPost.save(err => { 
            if (err)
              throw err
            console.log(`Saved ${++counter} so far`)
          })

        })
      })
    }) // callback hell !!
  }
})



