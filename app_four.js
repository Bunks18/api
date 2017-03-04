//setup the map
token = 'pk.eyJ1Ijoid2J1bmtlcjEiLCJhIjoiY2lrbGg3Mzl1MGl5a3UybTYwdWU0aHA2dSJ9.tA7pcbcM2XsrlcZo8TmX1g'


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
    for (var i = 0;i <= data.response.venues.length; i ++){
    item = data.response.venues[i]
    addItem(state,item);
    }

  }
});

}

//create array of all the locations
locations = {
   features: [
   ]
};
var getLocation = function(state){

  for (var i = 0; i <= state.items.length; i++){

   console.log(state.items[i].location.lat);
  }

}









//event handlers
$(document).ready(function(){


  L.mapbox.accessToken = token;
    var map = L.mapbox.map('map-one', 'mapbox.streets').setView([lat, long], 14);
    var myLayer = L.mapbox.featureLayer('mapbox.dc-markers').addTo(map);
myLayer.on('layeradd', function(e) {
  var popupContent = '<strong>' + e.layer.feature.properties.title + '</strong> <br />This map created with <a href="https://mapbox.com">Mapbox</a>!';
  e.layer.bindPopup(popupContent);
});







$( "#submit" ).click(function(event) {
  event.preventDefault();
  state.items = [];
  GetData(state);
  getLocation(state);
});


});
