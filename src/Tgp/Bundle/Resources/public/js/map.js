/* Initialisation de l'icone qui va suivre l'utilisateur s'il accepte */
function initFollower() {
    /* */
}

var showCount = 0;

function showPosition(position) {
    /*
    console.log("showPosition : showCount [" + showCount + "]");
    console.log(position);
    console.log(position.coords);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    console.log(position.coords.accuracy);
    console.log(position.coords.altitude);
    console.log(position.coords.altitudeAccuracy);
    console.log(position.coords.heading);
    console.log(position.coords.speed);*/
//    console.log(position.timestamp); // timestamp ?
    map.setView([position.coords.latitude, position.coords.longitude], 14);
}

var followCount = 0;

var follower = undefined;

function updateFollowerPos(arg) {
    if (follower == undefined) {
        var followerIcon = L.divIcon({size:"20px", html:"<p>YOU</p>" });
        follower = L.marker([arg.lat, arg.lng], {draggable:false, icon:followerIcon});
        map.addLayer(follower);
    } else {
        follower.setLatLng(arg);
    }
}

function followPosition(position) {
/*    console.log("followPosition : followCount [" + followCount + "]");
    console.log(position);
    console.log(position.coords);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    console.log(position.coords.accuracy);
    console.log(position.coords.altitude);
    console.log(position.coords.altitudeAccuracy);
    console.log(position.coords.heading);
    console.log(position.coords.speed);*/
//    console.log(position.timestamp); // timestamp ?
    map.setView([position.coords.latitude, position.coords.longitude], 14);
    updateFollowerPos({
        lat:position.coords.latitude,
        lng:position.coords.longitude
    });
}

function getLocation(follow) {
    if (navigator.geolocation) {
        if (follow == 1) {
            initFollower();
            navigator.geolocation.watchPosition(followPosition);
        } else {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    } else { 
/*        x.innerHTML = "Geolocation is not supported by this browser.";*/
    }
}

function stoppedFollower() {
    /* */
}

function stopFollower() {
    if (follower != undefined) {
        map.removeLayer(follower);
        follower = undefined;
    }
    navigator.geolocation.clearWatch(stoppedFollower);
}

function map_center () {
    /* TODO voir la fonction map.locate avec les options : http://leafletjs.com/reference.html#map-locate-options */
    /* TODO Bon après on peut quand même le faire à la main vu qu'on aura surement besoin de la geoloc en dur, a voir, a tester tout ca */
    getLocation(0);
}

function map_follow() {
    getLocation(1);
}

function map_stop_follow() {
    stopFollower();
}


