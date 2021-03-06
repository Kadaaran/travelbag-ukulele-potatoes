// Add mapbox, move etc

var map;
var markers = [];

function initialize() {
  //init map style
  var styles = [{"featureType":"all","elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]}];
  var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

  //init center of the map
  var mapOptions = {
    center: {lat: 38.7222524, lng: -9.139337},
    zoom: 4,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //set map styled and classic
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Create the search box and link it to the UI element.
  var input = document.getElementById('search-input');
  var searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place){
      var infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);

      //set markers and get name
      service.getDetails({
        placeId: place.place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //init marker per place
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            name: place.name
          })
          //push data to <li> and markers
          var placeName = place.formatted_address;

          markers.push(marker);
          console.log(markers);
          console.log(placeName);
          $(".places ul").append("<li>" + placeName + "</li>");

          //event onclick
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div><strong>' + placeName + '</strong><br>' + '</div>');
            infowindow.open(map, this);
          });
        }
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      $("#delete-all").click(function() {
        function setMapOnAll(map) {
          for (var i = 0; i < markers.length; i++) {
            console.log(i);
            markers[i].setMap(map);
          }
        }
        function deleteMarkers() {
          setMapOnAll(null);
          markers = [];
        }
        deleteMarkers();
        $( "li" ).remove();
      });

    });

    //set relevant zoom
    google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
      if (this.getZoom() > 15) {
        this.setZoom(15);
      }
    });
    map.fitBounds(bounds, places);
  });

}
