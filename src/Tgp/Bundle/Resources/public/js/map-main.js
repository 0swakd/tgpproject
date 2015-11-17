
/* Gestion de la taille de la carte : TODO voir si pas outdated, je pense que j'avais géré autrement la taille de la carte. */

function updateMapWidth() {
    var mapContainer = document.getElementById("map");

    var width = getScreenWidth();
    if (mapContainer.style.width != width - 7 + "px") 
        mapContainer.style.width = width - 7 + "px";
}


function updateMapHeight() {
    var mapContainer = document.getElementById("map");

    var height = getScreenHeight();
    if (mapContainer.style.height != height - 60 + "px") 
        mapContainer.style.height = height - 60 + "px";
}

/* Initialisaiton de la carte principale */
var map = undefined;

var layerOptions = [
    {name:'classic', layer:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'},
    {name:'dark', layer:'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'},
    {name:'light', layer:'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'},
    {name:'Satelite', layer:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution:'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'},
    {name:'Night', layer:'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', attribution:'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.', bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]], minZoom: 1, maxZoom: 8, format: 'jpg', time: '', tilematrixset: 'GoogleMapsCompatible_Level'},
    {name:'Neat', layer:'http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', attribution:'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: 'abcd', id:'tgpid', accessToken:'pk.eyJ1IjoiYW50b2luZXRncCIsImEiOiJjaWgybXlpejMwMG45a3FseTlkNHYxcWRxIn0.FE0AiRYUyzuYX0j23Nh-UQ'},
];

function setupMap() {
    updateMapHeight();
    updateMapWidth();

    var layer;
    var startView;
    var startZoom;

    if (typeof user == "object") {
        layer = user.layer;
        startView = user.startView;
        startZoom = user.startZoom;
    } else {
        layer = 0;
        startView = [48.853, 2.35];
        startZoom = 13;
    }

    var classic = L.tileLayer(layerOptions[0].layer, {attribution: layerOptions[0].attribution}),
        dark = L.tileLayer(layerOptions[1].layer, {attribution: layerOptions[1].attribution}),
        light = L.tileLayer(layerOptions[2].layer, {attribution: layerOptions[2].attribution}),
        satelite = L.tileLayer(layerOptions[3].layer, {attribution: layerOptions[3].attribution}),
        night = L.tileLayer(layerOptions[4].layer, {attribution: layerOptions[4].attribution, bounds: layerOptions[4].bounds, minZoom: layerOptions[4].minZoom, maxZoom: layerOptions[4].maxZoom, format: layerOptions[4].format, time: layerOptions[4].time, tilematrixset: layerOptions[4].tilematrixset}),
        neat = L.tileLayer(layerOptions[5].layer, {attribution: layerOptions[5].attribution, subdomains: layerOptions[5].subdomains, id: layerOptions[5].id, accessToken: layerOptions[5].accessToken})
            ;

    map = L.map('map', {
        center: startView,
        zoom: startZoom,
        layers: [classic]
    });

    var baseMaps = {
        "Classic": classic,
        "Dark": dark,
        "Light": light,
        "Satelite": satelite,
        "Neat" : neat,
        "Night": night,
    };

    L.control.layers(baseMaps, null, {position: 'bottomleft'}).addTo(map);

    map.on('click', mapClick);
}

/* Gestion du point d'interet : endroit ou l'utilisateur a ajouté une marque en cliquant dessus.  */
var lastclick = {};
var currentInterest = undefined;

function moveInterest(action, arg1) {
    if (action === "click" || action === "mark") {
        var pinme = document.getElementById("pinme").cloneNode(true);
        show(pinme);
        if (currentInterest == undefined) {
            currentInterest = L.marker([arg1.lat, arg1.lng], {draggable:true}).addTo(map)
                .bindPopup(pinme)
                .openPopup();
        } else {
            currentInterest.setLatLng(arg1)
                .bindPopup(pinme)
                .openPopup();
        }
        if (action == "mark") {
            map.setView([arg1.lat, arg1.lng], 18);
        }
    }
}

var nomapclick = 1;
/*var forevermapclick = 1;*/

function mapClickConfirmed() {
    moveInterest("click", lastclick.latlng);
    lastclick = {};

    nomapclick = 1;
    var mapNode = document.getElementById("map");
    removeclass(mapNode, "map-pin");
}

function mapClick(e) {
    if (nomapclick == 1) {
        return;
    }

    if (lastclick.timeout != undefined) {
        clearTimeout(lastclick.timeout);
        lastclick.timeout = undefined;
        return;
    }
    lastclick.latlng = e.latlng;
    lastclick.timeout = setTimeout(mapClickConfirmed, 500);
}

/* TODO penser comment faire pour avoir un mode forevermapclick pas le temps la */
function allow_map_click(forever) {
    nomapclick = 0;
    var mapNode = document.getElementById("map");
    addclass(mapNode, "map-pin");
}


/* Gestion des pins */
/* TODO faire quelque chose d'un peu plus generique pour pin_place : extraire la logique de pin_place pour que la carte soit un parametre et que le type d'affichage en soit un aussi pour pouvoir déplace pin_place dans map-utils.js  pareil pour pins ca doit etre un parametre :*/
var pins = {};


function pin_place(name, lat, lng, opt) {
    if (pins[name + lat + lng] != undefined) {
        return;
    }

    if (typeof opt == "string") {
        var myIcon = L.icon({
            iconUrl: '/bundles/tgp/images/pointer_red.png',
            iconSize: [25,41],
            iconAnchor: [12.5,41],
            popupAnchor: [0,-39],
            shadowUrl: '/bundles/tgp/images/shadow_small.png',
            shadowSize: [50,41],
            shadowAnchor: [12.5,41],
        });
        var marker = L.marker([lat, lng], {draggable:false, icon: myIcon});
    } else {
        var myIcon = L.icon({
            iconUrl: '/bundles/tgp/images/pointer_sky.png',
            iconSize: [25,41],
            iconAnchor: [12.5,41],
            popupAnchor: [0,-39],
            shadowUrl: '/bundles/tgp/images/shadow_small.png',
            shadowSize: [50,41],
            shadowAnchor: [12.5,41],
        });
        var marker = L.marker([lat, lng], {draggable:false, icon: myIcon});
//        var marker = L.marker([lat, lng], {draggable:false});
    }
    map.addLayer(marker);
    marker.bindPopup(name);
    pins[name + lat + lng] = marker;
}

function new_place_map(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = elem.lat;
    var lng = elem.lng;

    pin_place(name, lat, lng);
}

function new_friend_place_map(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = elem.lat;
    var lng = elem.lng;

    pin_place(name, lat, lng, "friend");
}




/* TODO voir si on deplace ca : */
function add_place() {
    var name = document.getElementById('mark_place_input').value;
    var latlng = currentInterest.getLatLng();
    var lat = latlng.lat;
    var lng = latlng.lng;
    send_add_place(name, lat, lng);
}

function radio_result (name) {
    var rates = document.getElementsByName(name);
    var rate_value;
    for(var i = 0; i < rates.length; i++){
        if(rates[i].checked){
            return rates[i].value;
        }
    }
    return undefined;
}

function pined_place_action() {
    var action = radio_result("reg_my_place");

    if (action == undefined) {
        return;
    }

    if (action === "my_adress") {
        add_place();
    } else if (action === "share_one") {
        alert("Action non supportee");
    } else {
        alert("Action non reconnue");
    }
    
    return;
}

