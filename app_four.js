//setup the map
token = 'pk.eyJ1Ijoid2J1bmtlcjEiLCJhIjoiY2lrbGg3Mzl1MGl5a3UybTYwdWU0aHA2dSJ9.tA7pcbcM2XsrlcZo8TmX1g'


// locations = {
//    venueLocation: []
// };

// initialize the state object
var state = {
    items: []
};

// add item to state
var addItem = function(state, item) {
    state.items.push(item);
};





var lat = '38.9072';
var long = '-77.0369';
var client_id = 'Y414UGHZIJ5SOPN5NT2WATWMYTTNJRNOIY2IJ0R0CREKLJX0';
var client_secret = 'M1TVJLFZC1HKUNAUXOF1FW3W1IIP1T0RTEPEYGTSKV50OGNM';
var v= '20170301';

//get geo location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    console.log(latlon);
    lat = position.coords.latitude;
    long = position.coords.longitude;
  }

// get the data
var GetData = function(state){
  $.ajax({
  dataType: "json",
  // url: 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&query=mcdonalds&client_id=Y414UGHZIJ5SOPN5NT2WATWMYTTNJRNOIY2IJ0R0CREKLJX0&client_secret=M1TVJLFZC1HKUNAUXOF1FW3W1IIP1T0RTEPEYGTSKV50OGNM&v=20170301',
  url: 'https://api.foursquare.com/v2/venues/search?ll='+lat + ',' + long + '&query=' + $('#queryfood').val() + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170301',
  success: function(data){
    for (var i = 0;i < data.response.venues.length; i ++){
    item = data.response.venues[i];
    lat = data.response.venues[i].location.lat;
    long = data.response.venues[i].location.lng;
    title = data.response.venues[i].name;
    coords = lat + ',' + long;
    addItem(state,item);
    // locations.venueLocation.push(coords);
    geojson.features.push(mapLatLong(long,lat, title))
    //get photo

    }
console.log(geojson)
  }
});

}


var geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -77.0366048812866,
         38.89784666877921
        ]
      },
      properties: {}
    },
  ]
};


function mapLatLong(lat,lng, title){
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        lat,
       lng
      ]
    },
    properties: {
      title: title
    }
  }
}


//event handlers
$(document).ready(function(){

console.log(geojson);
  L.mapbox.accessToken = token;
    var map = L.mapbox.map('map-one', 'mapbox.streets').setView([lat, long], 14);
    var myLayer = L.mapbox.featureLayer().addTo(map);
  //   myLayer.setGeoJSON(geojson);

$( "#submit" ).click(function(event) {
  event.preventDefault();
  state.items = [];
  geojson.features = [];
  GetData(state);
  $('#queryfood').val('')

    myLayer.setGeoJSON(geojson);

  // var myLayer = L.mapbox.featureLayer().addTo(map);
});

$( "#submit1" ).click(function(event) {
  event.preventDefault();
  myLayer.setGeoJSON(geojson);


});


});
