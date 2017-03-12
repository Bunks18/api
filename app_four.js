//setup the map
var token = 'pk.eyJ1Ijoid2J1bmtlcjEiLCJhIjoiY2lrbGg3Mzl1MGl5a3UybTYwdWU0aHA2dSJ9.tA7pcbcM2XsrlcZo8TmX1g';
var lat = '38.9072';
var long = '-77.0369';
var client_id = 'Y414UGHZIJ5SOPN5NT2WATWMYTTNJRNOIY2IJ0R0CREKLJX0';
var client_secret = 'M1TVJLFZC1HKUNAUXOF1FW3W1IIP1T0RTEPEYGTSKV50OGNM';
var v= '20170301';
var map = null;

//initialize  the state
state = {
  searches: [],
  items: [],
  index: 0,
  geojson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: ['',''
          ]
        },
        properties: {}
      },
    ]
  }
}

// add item to state
var addItem = function(state, item) {
    state.items.push(item);
};

//get geo location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

//get location
function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    console.log(latlon);
    lat = position.coords.latitude;
    long = position.coords.longitude;
  }

// add markers to geojson object
  function mapLatLong(lat,lng, title, url){
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
        title: title,
        description: "<a href="+ url + ">" + url + "</a>",
        'marker-color': '#63b6e5',
        'marker-symbol': ''
      }
    }
  }

//create map
  function createMap(lat,long, geojson){
    map = L.mapbox.map('map-one', 'mapbox.streets').setView([lat, long], 14);
    L.mapbox.accessToken = token;
    var myLayer = L.mapbox.featureLayer().addTo(map);
    myLayer.setGeoJSON(geojson);
  }


  //write previous results

  function writeResults(state){
    for (var i=0; i<state.searches.length; i++) {
          var html='';
          html+= '<a>'+state.searches[i]+'</a>';
      }
        document.getElementById('prev-search').innerHTML+= html;
    }

// Ajax API Call
var GetData = function(state){
  $.ajax({
  dataType: "json",
  url: 'https://api.foursquare.com/v2/venues/search?ll='+lat + ',' + long + '&query=' + $('#queryfood').val() + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170301',
  success: function(data){
    for (var i = 0;i < data.response.venues.length; i ++)
        {
          item = data.response.venues[i];
          lat = data.response.venues[i].location.lat;
          long = data.response.venues[i].location.lng;
          title = data.response.venues[i].name;
          // contact = data.response.venues[i].contact.phone;
          url = data.response.venues[i].url;
          addItem(state,item);
          state.geojson.features.push(mapLatLong(long,lat, title, url))
        } //end of loop
        createMap(lat,long, state.geojson)
  }
});

//push query searches into state object
 state.searches.push($('#queryfood').val());

//render past results
 writeResults(state);

}


//event handlers
$(document).ready(function(){
  //create map to start
  L.mapbox.accessToken = token;
    map = L.mapbox.map('map-one', 'mapbox.streets').setView([lat, long], 14);

//click event for search
  $( "#submit" ).click(function(event) {
      event.preventDefault();
      // state.items = [];
      state.geojson.features = [];
      map.off();
      map.remove();
      GetData(state);
      $('#queryfood').val('');


//scroll down to map after submit
      $('html, body').animate({
          scrollTop: $("#map-section").offset().top
      }, 2000);
    });
  });
