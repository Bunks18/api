//setup the map
var token = 'pk.eyJ1Ijoid2J1bmtlcjEiLCJhIjoiY2lrbGg3Mzl1MGl5a3UybTYwdWU0aHA2dSJ9.tA7pcbcM2XsrlcZo8TmX1g';
var lat = '38.9072';
var long = '-77.0369';
var client_id = 'Y414UGHZIJ5SOPN5NT2WATWMYTTNJRNOIY2IJ0R0CREKLJX0';
var client_secret = 'M1TVJLFZC1HKUNAUXOF1FW3W1IIP1T0RTEPEYGTSKV50OGNM';
var v= '20170301';
var map = null;

var globLat = '';
var globLong = '';

//initialize  the state
state = {
  searches: [],
  items: [],
  geojson: {
    type: 'FeatureCollection',
    features: []
  }
}

//



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
    globLat = position.coords.latitude;
    globLong = position.coords.longitude;
  }

// add markers to geojson object
  function mapLatLong(lat,lng, title, url, query){
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
        description: "<a href="+ url + " target='_blank'>" + url + "</a>",
        'marker-color': '#63b6e5',
        'marker-symbol': '',
        query: query
      }
    }
  }


//create map
  function createMap(globLat,globLong, geojson){
    map = L.mapbox.map('map-one', 'mapbox.streets').setView([globLat, globLong], 14);
    L.mapbox.accessToken = token;
    var myLayer = L.mapbox.featureLayer().addTo(map);
    myLayer.setGeoJSON(geojson);
  }

//write previous results
  function writeResults(state){
    for (var i=0; i<state.searches.length; i++) {
          var html= '';
          html = '<a class="searchLink"><h3>'+ state.searches[i].search +'</h2></a>';

      }
        $('#prev-search').append(html);
    }


// Previous search function
function getPreviousSearch(state, searchText) {
  map.off();
  map.remove();

  for (var i = 0; i < state.searches.length; i++ ){
  if (state.searches[i].search === searchText){
    createMap(globLat, globLong, state.searches[i].geojson);
    break;
    }
  }
}

// Ajax API Call
var GetData = function(state, query){
  console.log(query);

  var searchResults = {
    search : query,
    lat: '',
    long: '',
    geojson: {
        type: 'FeatureCollection',
        features: []
    }
  };


  $.ajax({
  dataType: "json",
  url: 'https://api.foursquare.com/v2/venues/search?ll='+globLat + ',' + globLong + '&query=' + $('#queryfood').val() + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170301',
  success: function(data){
    for (var i = 0;i < data.response.venues.length; i ++)
        {
          item = data.response.venues[i];
          lat = data.response.venues[i].location.lat;
          long = data.response.venues[i].location.lng;
          title = data.response.venues[i].name;
          url = data.response.venues[i].url;
          if (url == null){
            url =  data.response.venues[i].location.address;
          }
          addItem(state,item);
          searchResults.geojson.features.push(mapLatLong(long,lat,title,url,query))
        } //end of loop
        console.log(searchResults);

        //create the map
        createMap(globLat,globLong, searchResults.geojson);

        //populate the previous searches array
        state.searches.push(searchResults);

      } //end success
    })
.done(function(data){
  writeResults(state);
  });
}




//event handlers
$(document).ready(function(){

  $('#map-container').hide();
  getLocation();

  //create map to start
  L.mapbox.accessToken = token;
    map = L.mapbox.map('map-one', 'mapbox.streets').setView([globLat, globLong], 14);

//click event for search
  $( "#submit" ).click(function(event) {
    $('#map-container').show();
      event.preventDefault();
      // state.items = [];
      // state.geojson.features = [];
      map.off();
      map.remove();
      query = $('#queryfood').val();
      GetData(state, query);
      $('#queryfood').val('');

//scroll down to map after submit
      $('html, body').animate({
          scrollTop: $("#map-section").offset().top
      }, 2000);
    });


    $(document).on('click', '.searchLink', function(){
      var text = $(this).text();
      getPreviousSearch(state, text);
    });




  });
