window.peopleList=[];
window.personNum=0;

// Ny kod

function createGame(){
	// var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
	// helper.setPassword(hex_md5("lo8604924%."));

	var gameNameValue = $('#gameName').val();
	var hostAliasValue = $('#hostAlias').val();
	
	// if ( helper ) {
		// var dataObject = {
			// "gameName" : gameNameValue,
			// "hostAlias" : hostAliasValue
		// };

		// helper.insertDocument("games", dataObject, null);

	// }
	
	document.getElementById('gameText').innerHTML+=gameNameValue;
	// document.getElementById('hostText').innerHTML+=hostAliasValue;
};


function joinGame(){
	var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
	helper.setPassword(hex_md5("lo8604924%."));
	
	var gameNameValue = $('#joinGameName').val();
	var aliasValue = $('#joinAlias').val();
	
	// if ( helper ) {
		// var dataObject = {
			// "gameName" : gameNameValue,
			// "alias" : aliasValue
		// };

		// helper.insertDocument("games", dataObject, null);

	// }
	
	document.getElementById('joinGameText').innerHTML=gameNameValue;
	document.getElementById('joinAliasText').innerHTML=aliasValue;
	
};

function updatePlayerList(){
	var test = document.getElementById('gameText').innerHTML;
	alert(test);
	var searchCondition1 = { "game" : test };
	
	helper.searchDocuments(searchCondition1,"games", 
		function(resp) {
			var players='<br/>';
			for (index in resp.outputData){
				var rest1 = resp.outputData[index];
				players = players+ rest1.alias+'<br/><br/>';
			
				
			}
			document.getElementById('playerList').innerHTML=players;
			
		}
	);
};			
// Slut Ny Kod


function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(59.346630, 18.072056),
	  zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	

}




function addPerson(){

  if (navigator.geolocation){
  	//console.log(navigator.geolocation);
	
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{
	alert("Geolocation is not supported by this browser.");
  	}
  
  	function showPosition(position){
 	
  		var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
		helper.setPassword(hex_md5("lo8604924%."));
		
		var gameNameValue = $('#joinGameName').val();
		var aliasValue = $('#joinAlias').val();
		
		var dataObject = {
			"game_name" : gameNameValue,
			"alias" : aliasValue,
			"lat_coords" : position.coords.latitude,
			"lng_coords" : position.coords.longitude
		};
		
		search(dataObject);
		
		
		function search(dataObject){

				var user = new google.maps.LatLng(dataObject.lat_coords, dataObject.lng_coords);
				var rad = function(x) {
				  return x * Math.PI / 180;
				};
				
				var getDistance = function(p1, p2) {
				  var R = 6378137; // Earth’s mean radius in meter
				  var dLat = rad(p2.lat() - p1.lat());
				  var dLong = rad(p2.lng() - p1.lng());
				  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
				    Math.sin(dLong / 2) * Math.sin(dLong / 2);
				  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				  var d = R * c;
				  return d; // returns the distance in meter
				};
				
				helper.searchDocuments(
					null, "people", function(resp){
						var k=0; // En variabel som ökar vid varje "distanserad bänk"
						for (var i=0; i<resp.outputData.length; i++){
								var person = new google.maps.LatLng(resp.outputData[i].lat_coords, resp.outputData[i].lng_coords);
								
								if (getDistance(user,person)>30){ //Ska vi köra tio meter?
									k=k+1;
								}
						}
						if(k == resp.outputData.length){
							add(dataObject);
						}
						else{
							alert("Du står för nära någon annan, FLYTTA PÅ DIG!")
						}
					});
				
				};
		function add(dataObject){
			helper.insertDocument("people", dataObject, null, function(resp) {
				alert("Du är nu gömd!");
			});
			};  
	}
};

function resize(dist) {
	var size=(100/(1+dist*0.1));
	console.log(size);
	
	$("#arrow").css({ 
		'width' : size+'%',
		'height' : size+'%'
	
	/*	'-webkit-transform': 'resize('+degrees+'deg)',
		'-moz-transform': 'resize('+degrees+'deg)',
		'-o-transform': 'resize('+degrees+'deg)',
		'-ms-transform': 'resize('+degrees+'deg)',
		'transform': 'resize('+degrees+'deg)' */
		});
}

function getDistance(){
	var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
	helper.setPassword(hex_md5("lo8604924%."));
	
	if (navigator.geolocation){

    	navigator.geolocation.watchPosition(showPosition);
    }
  	else{
		alert("Geolocation is not supported by this browser.");
  	}

  	function showPosition(position){


	
	
		var my_lat=position.coords.latitude;
		var my_lng=position.coords.longitude;
		var my_LatLng = new google.maps.LatLng(my_lat, my_lng);
		
		
		var rad = function(x) {
		  return x * Math.PI / 180;
		};

		var getDistanceBetween = function(p1, p2) {
		  var R = 6378137; // Earth’s mean radius in meter
		  var dLat = rad(p2.lat() - p1.lat());
		  var dLong = rad(p2.lng() - p1.lng());
		  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
		    Math.sin(dLong / 2) * Math.sin(dLong / 2);
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		  var d = R * c;
		  return d; // returns the distance in meter
		};
		
		var gameName2 = $('#gameText').val();
		var searchCondition = { "game" : gameName};
		alert(gameName2);
		
		helper.searchDocuments(
			searchCondition, "people", function(resp){
			for (var i = 0; i < resp.outputData.length; i++){
				var person_LatLng = new google.maps.LatLng(resp.outputData[i].lat_coords, resp.outputData[i].lng_coords);
				var dist = getDistanceBetween(my_LatLng, person_LatLng);
				window.peopleList[i]={"distance":dist, "lat_coords":resp.outputData[i].lat_coords,"lng_coords":resp.outputData[i].lng_coords, "my_LatLng":my_LatLng, "person_LatLng":person_LatLng};				
			}			
				$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));
				resize(window.peopleList[window.personNum].distance.toFixed(2));
			
			}
		);
	}	
}
function newPerson(){
	if(window.personNum<parseInt(window.peopleList.length-1)){
		
		window.personNum=window.personNum+1;

		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));

		resize(window.peopleList[window.personNum].distance.toFixed(2));
	}
	else{
		alert("Inga fler gömda");
	}
};
function oldPerson(){
	if(window.personNum!=0){
		window.personNum=window.personNum-1;
		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));	
		resize(window.peopleList[window.personNum].distance.toFixed(2));
		
	}else{
		alert("Swipe:a inte, det finns inga fler!")
	}	
};