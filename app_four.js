$(document).ready(function(){



// initialize the state

  var lat = '';
  var long = '';
  var query = $('#queryfood').val();
  var client_id = "";
  var client_secret = "";

function GetData(){
  $.getJSON('https://api.foursquare.com/v2/venues/search?ll=40.7,-74&query='+ query + 'mcdonalds&client_id=Y414UGHZIJ5SOPN5NT2WATWMYTTNJRNOIY2IJ0R0CREKLJX0&client_secret=M1TVJLFZC1HKUNAUXOF1FW3W1IIP1T0RTEPEYGTSKV50OGNM&v=20170301',
    function(data) {
        // $.each(data.response.venues, function(venues){
              // content = '<p>' + venues.name + '</p>';
              // $(content).appendTo("#names");
            console.log(data);
      //  });


// push objects into the state

// display objects in the state

});
}

$( "#submit" ).click(function(event) {
  event.preventDefault();
  var query = $('#queryfood').val();
  console.log(query);
});

GetData();

});
