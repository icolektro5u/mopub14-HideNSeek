window.peopleList=[];
window.personNum=0;

// Supposed to remove an object when the "owner" of the object is found
function removePerson(){
	alert("removePerson-funktion");
};

// Creates a room so that a game can be played
function createGame(){
	var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
	helper.setPassword(hex_md5("lo8604924%."));
	
	var gameNameValue = $('#gameName').val();
	var hostAliasValue = $('#hostAlias').val();
	
	
	var searchCondition4 = { "game_name" : gameNameValue };
	// Checks if there are already games with the same name
	helper.searchDocuments(
		searchCondition4, "people", function(resp){
			// If there is such a game alert user of it
			if(resp.outputData[0]){
				alert(gameNameValue + " already exists");
			}
			// If such a game does not exist, create it
			else{
				if ( helper ) {
					var dataObject = {
						"game_name" : gameNameValue,
						"host_alias" : hostAliasValue
					};

					helper.insertDocument("people", dataObject, null);
				}
				// Writes game info on next page for storage
				document.getElementById('gameText').innerHTML=gameNameValue;
				document.getElementById('hostText').innerHTML=hostAliasValue;
				// Goes to next page
				location.href = '#waitingPage';
			}
		}
	);
	
	

};

// Starts process of joining a game
function joinGame(){
	var helper = new CBHelper("lab5_mopub14", "243cf93c71c270f90d7290e338d1e72e", new GenericHelper());
	helper.setPassword(hex_md5("lo8604924%."));
	
	var gameNameValue = $('#joinGameName').val();
	var aliasValue = $('#joinAlias').val();
	
	var searchCondition2 = { "game_name" : gameNameValue };
	// Check if there is a game (with the given name) to join
	helper.searchDocuments(
		searchCondition2, "people", function(resp){
			// If there is a game
			if(resp.outputData[0]){
				var searchCondition5 = { $or : [ { "alias" : aliasValue } , { "host_alias" : aliasValue } ] };
				// Checks if there is another player with same alias in the same game (though player objects are created after hiding)
				helper.searchDocuments(
					{ $and: [ searchCondition2, searchCondition5 ] }, "people", function(resp){
						// If there is a player with same name alert user
						if(resp.outputData[0]){
							alert(aliasValue + " already exists");
						}
						// If there is no such player store the game name and alias on next page and go to it
						else{
							document.getElementById('joinGameText').innerHTML=gameNameValue;
							document.getElementById('joinAliasText').innerHTML=aliasValue;
							location.href = '#slask';
						}
					}
				);
				
			}
			// If such a game does not exist alert user
			else{
				alert(gameNameValue + " doesn't exists");
			}
		}
	);
	
};
	
// Updates list of players (funkar inte)
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
				
				
				var searchCondition3 = { $and: [ { "game_name": gameNameValue }, { "lat_coords" : { $exists : true } } ] };
				helper.searchDocuments(
					searchCondition3, "people", function(resp){
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
};
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