let mapDefaultSettings = {
  lat: 40.7480961,
  lng: -73.9905352,
  zoom: 12
}
let map = new GMaps({
  div: '#map',
  lat: mapDefaultSettings.lat,
  lng: mapDefaultSettings.lng,
  zoom: mapDefaultSettings.zoom
});

let markers = {}

var request = new XMLHttpRequest();
request.open('GET', '/posts', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var posts = JSON.parse(request.responseText);

    posts.forEach(function(post) {
      markers[post._id] = map.addMarker({
        lat: post.gMapsLocation.lat,
        lng: post.gMapsLocation.lng,
        title: post.gMapsLocation.name,
        icon: 'http://findicons.com/files/icons/1449/more_kidcons/32/slice_of_pizza.png',
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

  } else {
    console.error('Oups!')
  }
};

request.onerror = function() {
  console.error('Error!')
};

request.send();

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




