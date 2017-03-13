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
        description: "<a href="+ url + ">" + url + "</a>",
        'marker-color': '#63b6e5',
        'marker-symbol': '',
        query: query
      }
    }
  }




//create map
  function createMap(lat,long, geojson){
    map = L.mapbox.map('map-one', 'mapbox.streets').setView([lat, long], 14);
    L.mapbox.accessToken = token;
    var myLayer = L.mapbox.featureLayer().addTo(map);
    myLayer.setGeoJSON(geojson);
//
// var newArray = geojson.features.filter(function (el) {
//     return el.geojson.features.properties.query === query;
//   });

// function filter(geojson,query) {
//
//   var newArray = {
//         type: 'FeatureCollection',
//         features: []
//       };
//
// for (var i = 0; i < geojson.features.length ; i++) {
//     if (geojson.features[i].properties.query === query) {
//         newArray.push(geojson.features[i]);
//     }
// }
//
// }



  }


  //write previous results

  function writeResults(state){
    for (var i=0; i<state.searches.length; i++) {
          var html= '';
          html+= '<a class="searchLink">'+ state.searches[i].search +'</a> <br>';

      }
        $('#prev-search').append(html);
    }

// Ajax API Call
var GetData = function(state, query){
  console.log(query);
  // state.searches.push({search:'', items: []});

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
  url: 'https://api.foursquare.com/v2/venues/search?ll='+lat + ',' + long + '&query=' + $('#queryfood').val() + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170301',
  success: function(data){
    for (var i = 0;i < data.response.venues.length; i ++)
        {
          item = data.response.venues[i];
          lat = data.response.venues[i].location.lat;
          long = data.response.venues[i].location.lng;
          title = data.response.venues[i].name;
          // query = $('#queryfood').val();
          // contact = data.response.venues[i].contact.phone;
          url = data.response.venues[i].url;
          addItem(state,item);
          // state.geojson.features.push(mapLatLong(long,lat, title, url, query))

          searchResults.geojson.features.push(mapLatLong(long,lat,title,url,query))
        } //end of loop



        console.log(searchResults);

        createMap(lat,long, searchResults.geojson);


        state.searches.push(searchResults);

      } //end success
    })
.done(function(data){
  writeResults(state);
  });
}


function getPreviousSearch(state, searchText) {

  for (var i = 0; i < state.searches.length; i++ ){
  if (state.searches[i].search === searchText){

    createMap(lat, long, state.searches[i].geojson);
    break;
  }

  }

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

    $(document).on('click', '.searchLink', function(event){
      event.preventDefault();
      getPreviousSearch(state, $(this).text);
      //
    });

  });
