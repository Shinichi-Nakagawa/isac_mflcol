var startLat = 35.4051;
var startLng = 139.46915;
var endLat = -33.822530;
var endLng = 151.122481;
var radius = 50;
var magneticPath = null;
var conjugate1 = null;
var conjugate2 = null;

function initialize() {
  var latlng = new google.maps.LatLng(35.681382, 139.766084);
  var myOptions = {
    zoom : 8,
    center : latlng,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  map.setMapTypeId(google.maps.MapTypeId.HYBRID);
  map.setZoom(3);
  google.maps.event.addListener(map, 'click', function(event) {
    startLat = event.latLng.lat();
    startLng = event.latLng.lng();
    endLat = -event.latLng.lat();
    endLng = event.latLng.lng();
    if(magneticPath != null) {
      magneticPath.setMap(null);
    }
    if(conjugate1 != null) {
      conjugate1.setMap(null);
    }
    if(conjugate2 != null) {
      conjugate2.setMap(null);
    }

    var path = new Array;

    var n = 10;
    var curvature = 0.015;
    for(var i = 0; i < n; ++i) {
      var lat = startLat + (endLat - startLat) / n * i;
      var lng = startLng + curvature * (Math.pow(startLat, 2) - Math.pow(lat, 2));
      path.push(new google.maps.LatLng(lat, lng));
    }
    path.push(new google.maps.LatLng(endLat, startLng));

    var circleOptions1 = {
      center : new google.maps.LatLng(startLat, startLng),
      radius : radius * 1000,
      strokeWeight : 3,
      strokeColor : "#FF0000",
      strokeOpacity : 1.0,
      fillColor : "#FF0000",
      fillOpacity : 0.5
    };
    var circleOptions2 = {
      center : new google.maps.LatLng(endLat, endLng),
      radius : radius * 1000,
      strokeWeight : 3,
      strokeColor : "#FF0000",
      strokeOpacity : 1.0,
      fillColor : "#FF0000",
      fillOpacity : 0.5
    };
    conjugate1 = new google.maps.Circle(circleOptions1);
    conjugate2 = new google.maps.Circle(circleOptions2);
    conjugate1.setMap(map);
    conjugate2.setMap(map);

    magneticPath = new google.maps.Polyline({
      path : path,
      strokeColor : "#FF0000",
      strokeOpacity : 1.0,
      strokeWeight : 3
    });
    magneticPath.setMap(map);
    
    get_venues(map, endLat, endLng);
    map.setCenter(new google.maps.LatLng(endLat, endLng));
  });
}

function load_image(url) {
  var images = null;
  $.ajax({
    url : url,
    cache : false,
    type : "json",
    success : function(json) {
      images = json;
    }
  });
  console.log(images);
}

function get_tweet(lat, lng, r, selector) {
  $.getJSON("http://search.twitter.com/search.json?callback=?", {
    geocode : lat + ',' + lng + ',' + r + 'km',
    page : "1",
    rpp : "10",
    result_type : "recent"
  }, function(data) {
    var html = "";
    // profile_image_url
    for(var i = 0; i < data.results.length; ++i) {
      html += '<li><a href="https://twitter.com/#!/' + data.results[i].from_user + 
               '"><img src="' + data.results[i].profile_image_url + '"/></a>' +
               data.results[i].text
              '</li>';
      //html += '<tr><td>' + data.results[i].from_user + '</td>' + '<td><img width=16 height=16 src="' + data.results[i].profile_image_url + '"></td>' + '<td>' + data.results[i].text + '</td></tr>';
    }
    $(selector + '>ul').html(html);
  });
}

var timerId;
function onTimer() {
  get_tweet(startLat, startLng, radius, '#twitter_side_a');
  get_tweet(endLat, endLng, radius, '#twitter_side_b');
  timerID = setTimeout('onTimer()', 3000);
}


$(document).ready(function() {
  // $("#dialog1").hide();
  // $("#dialog1").dialog({width: '360px'});

  timerID = setTimeout('onTimer()', 1000);
});

function destroy() {
} 
