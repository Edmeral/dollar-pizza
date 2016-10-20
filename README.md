<p align="center">
  <a href="http://pizza.aissam.me/">
    <img alt="Pizza slice" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Emoji_u1f355.svg/2000px-Emoji_u1f355.svg.png" width="300" />
  </a>
</p>

<p align="center">
  Finding out the best $1 pizza slice in NYC.
</p>

<p align="center">
  <a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
</p>

---

This [guy](https://www.instagram.com/dollarpizzaslicenyc/) is running around NYC trying every $1 pizza slice and documents his journey on his instgram account, he gives scores from 1 to 5 to cheese, sauce and crust, I wanted to know what is the best pizza slice out there but it turns out it's a tricky question.

There is no way to find out the best slice from the instagram page only (unless you're willing to manually read every photo description), we need way to automate this task!

### Scraping
We need to get every image and it's description from his instagram profile, from the description we can parse the cheese/sauce/crust scores, and then I store all the data in a MongoDB collection.

### Image recognision
Not all images posted on that instgram account are of pizza slices, we need a way to filter out other images, one way to do that is by using [Google Vision API](https://cloud.google.com/vision/) (`vision` folder), you send an image to their servers and you get a set of labels (like 'food' or 'dish' for a  pizza slice).

### Mapping the places
Once I have all the data, What's left is to  get the some additional information (like latitute and longitutde) from [Google Places API](https://developers.google.com/places/) of the different pizza places, and then put everything on a map, the result is [here](http://pizza.aissam.me), and the code for it is on the [gh-pages](https://github.com/Edmeral/dollar-pizza/tree/gh-pages) branch.

## How to use 
Create a `.env` file on the root directory containing the following environnement variables
```
GOOGLE_PLACES_API_KEY=API key for Google Places
GOOGLE_APPLICATION_CREDENTIALS=path to a json key file given by Google Vision API
GCLOUD_PROJECT=name of the gcloud project used to get the API keys
```
Have a running a local MongoDB instance and a databse named `pizza`. (all scraped data is stored there).

```sh
$ node scrape.js
```
Running this command will fill up the pizza database with information to every $1 pizza place featured in the instagram account!

I made a little script to export all the [data](https://github.com/Edmeral/dollar-pizza/blob/gh-pages/js/posts.js) from the database to JSON object which is used for the website availlible at the [gh-pages](https://github.com/Edmeral/dollar-pizza/tree/gh-pages) branch.
