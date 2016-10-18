// Instantiate a vision client
// internally it uses 2 env variables for auth:
// GOOGLE_APPLICATION_CREDENTIALS for the json key file and
// GCLOUD_PROJECT specifiying the id of the project in the gcloud platform
require('dotenv').config()
const vision = require('@google-cloud/vision')();

/**
 * Uses the Vision API to detect labels in the given file.
 */

function isPizza(pizzaUrl, callback) {
  vision.detectLabels(pizzaUrl, { verbose: true }, function (err, labels) {
    if (err) 
      return callback(err, null);
    labels = labels.reduce((labelsList, label) => [...labelsList, label.desc], [])
    let result = labels.includes('food') || labels.includes('dish')
    callback(null, result)
  });
}

// testing
/* let url = 'https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.png'
let pizzaUrl = 'https://scontent.cdninstagram.com/t51.2885-15/e15/1962952_338954369648803_1585787586_n.jpg?ig_cache_key=OTM5ODQ1NDg5Nzk1Nzg1NjE4.2'
isPizza('https://scontent.cdninstagram.com/t51.2885-15/s750x750/sh0.08/e35/12935027_1598075183845172_1891802467_n.jpg?ig_cache_key=MTIzMjE0NDE1MDc2NjgwNjAxMQ%3D%3D.2', (err, result) => {
  console.log(result)
}) */

module.exports = isPizza
