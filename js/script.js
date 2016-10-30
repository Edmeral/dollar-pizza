/*
  Constructing the map
 */
var mapDefaultSettings = {
  lat: 40.7480961,
  lng: -73.9905352,
  zoom: 12
}
var map = new GMaps({
  div: '#map',
  lat: mapDefaultSettings.lat,
  lng: mapDefaultSettings.lng,
  zoom: mapDefaultSettings.zoom
});

var markers = {}

posts.forEach(function(post) {
  markers[post._id] = map.addMarker({
    lat: post.gMapsLocation.lat,
    lng: post.gMapsLocation.lng,
    title: post.gMapsLocation.name,
    icon: 'slice.png',
    infoWindow: {
      content: '<p>' + post.gMapsLocation.name  +
        '<br> Score: ' + post.score + '<br>' +
        '<a href="' + post.gMapsLocation.url + '">Open in Google maps</a></p>'
    },
    click: function() {
      zoomToMarkerId(map, markers, post._id)
    }
  });
})

/*
  Constructing the sidebar
 */
posts.forEach(function(post) {
  var cardDiv = document.createElement('div')
  cardDiv.className = 'card'
  cardDiv.setAttribute('pizza-id', post._id)

  var link = document.createElement('a')
  link.setAttribute('href', 'https://www.instagram.com/p/' + post._id)

  var pizzPic = document.createElement('img')
  pizzPic.className = 'img-pizza'
  pizzPic.setAttribute('src', 'images/' + post['_id'] + '-small.jpg')

  link.appendChild(pizzPic)
  cardDiv.appendChild(link)

  var paragraph = document.createElement('p')
  paragraph.className = 'pizza-description'
  paragraph.innerHTML = '<strong>' + post.gMapsLocation.name + '</strong> <br>' +
    'Score: ' + post.score + '<br>' +
    '🧀: ' + post.cheese + ' 🍝: ' + post.sauce +' 🍕: ' + post.crust + '<br>' +
    post.gMapsLocation.adress + '<br>'

  var adressLink = document.createElement('a')
  adressLink.setAttribute('href', post.gMapsLocation.url)
  adressLink.innerHTML = 'Open in Gmaps'

  paragraph.appendChild(adressLink)

  cardDiv.appendChild(paragraph)

  document.querySelector('#places').appendChild(cardDiv)
})

function zoomToMarkerId(map, markers, markerId) {
  map.setCenter(markers[markerId].getPosition().lat(), markers[markerId].getPosition().lng())
  map.setZoom(15)
}

let selectedCard

function onCardClick(e) {
  e.stopPropagation()
  if (selectedCard)
    selectedCard.className = 'card'
  selectedCard = e.currentTarget
  map.hideInfoWindows()
  selectedCard.className = 'card selected'
  let pizzaId = selectedCard.getAttribute('pizza-id')
  markers[pizzaId].infoWindow.open(map, markers[pizzaId]);
  zoomToMarkerId(map, markers, pizzaId)
}

document.addEventListener('click', function(e) {
  if (selectedCard) {
    map.hideInfoWindows()
    map.setCenter(mapDefaultSettings.lat, mapDefaultSettings.lng)
    map.setZoom(mapDefaultSettings.zoom)
    selectedCard.className = 'card'
  }
})

document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('click', onCardClick)
})

document.querySelector('#map').addEventListener('click', function(e) {
  e.stopPropagation()
})




