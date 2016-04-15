

var geocoder;
var map;
var markers = Array();
var infos = Array();
var places =  Array();
var json  = [];
var cityCircle;

//update the radius circle
function updateCircle() {
	cityCircle.setMap(null);
	var radius = document.getElementById('gmap_radius').value;
	radius =  parseInt(radius, 10);
	 cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: map.center,
            radius: radius
          });
		  
		  
		  
}

function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (New York)
    var myLatlng = new google.maps.LatLng(40.7143528,-74.0059731);

    var myOptions = { // default map options
        zoom: 11,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
	var radius = document.getElementById('gmap_radius').value;
	radius =  parseInt(radius, 10);
    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
	  cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: map.center,
            radius: radius
          });
		//  cityCircle.setMap(null);
		
		
	 google.maps.event.addListener(map, 'click', function (e) {
              
			// store current coordinates into  variables
            document.getElementById('lat').value = e.latLng.lat();
            document.getElementById('lng').value = e.latLng.lng();
			document.getElementById('gmap_where').value = "";
			//when you click the map take the new coordinates and find their location
			findAddress();
            });
	 
}

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}

// find address function
function findAddress() {
    var address = document.getElementById("gmap_where").value;

	
    // script uses our 'geocoder' in order to find location by address name
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

		
			
			
            // we will center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);
			
				updateCircle();
			
            // store current coordinates into hidden variables
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();

            // and then - add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'marker.png'
            });
        } else {
            //alert('Geocode was not successful for the following reason: ' + status);
			
			//if there is nothingh in the where box set the map to the coordinates
			var lat1 = document.getElementById('lat').value;
			var lng1 = document.getElementById('lng').value;
			var myLatlng = new google.maps.LatLng(lat1,lng1);
			map.setCenter(myLatlng);
			updateCircle();
        }
    });
	 
	
	
}

// find custom places function
function findPlaces() {

    // prepare variables (filter)
    var type = document.getElementById('gmap_type').value;
    var radius = document.getElementById('gmap_radius').value;
    var keyword = document.getElementById('gmap_keyword').value;

    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

	
    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        types: [type]
    };
    if (keyword) {
        request.keyword = [keyword];
    }

    // send request
	
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
}

// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

       
        
	

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
			places.push(results[i]);
			
			
        }
		reloadList();
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        alert('Sorry, nothing is found');
    }
}

// creare single marker function
function createMarker(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    markers.push(mark);

    // prepare info window
    var infowindow = new google.maps.InfoWindow({
        content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
    });
	
	
		
		
 
		
		

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        infowindow.open(map,mark);
    });
    infos.push(infowindow);
	
	
	
	
}

function clearList()
{

places.splice(0, places.length ); 
document.getElementById('list').innerHTML = "";
clearOverlays();	
}
function reloadList()
{
	//places[i].geometry.location.lat()
	//places[i].geometry.location.lng()
	document.getElementById('list').innerHTML = "";
	for (i = 0; i < places.length; i++) {
	
		
    document.getElementById('list').innerHTML += "<tr><td>" + places[i].name + "</td><td> " + places[i].vicinity + "</td><td><i onclick='deleteItem("+i+")'class='fa fa-trash'></i></td></tr>";
		}
	
	
}
function deleteItem(index){
	places.splice(index, 1);
	reloadList();
}

function sendList()
{



for (var i = 0; i < places.length; i++) {
json.push({
        name: places[i].name,
        address: places[i].vicinity,
		lat: places[i].geometry.location.lat(), 
		lng: places[i].geometry.location.lng()
    });
}

var encodedData = window.btoa(JSON.stringify(json)); 


//window.open("file:///C:/Users/DAK64/Desktop/placesTOGIS/map.html?data="+ encodedData);

	window.open("map.html?data="+ encodedData);
 
}

// initialization
google.maps.event.addDomListener(window, 'load', initialize);















































