
function hide(obj, disp) {
    if (obj == null || typeof(obj) == "undefined") {
        return;
    }
    obj.style.display = (typeof(disp) == "undefined") ? "none" : disp;
    return obj;
}

function show(obj, disp) {
    if (obj == null || typeof(obj) == "undefined") {
        return;
    }
    obj.style.display = (typeof(disp) == "undefined") ? "block" : disp;
    return obj;
}

function getXhr() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function getTarget(e) {
    var targ;

    var ev = e | window.event;

    if (e.target) {
        targ = e.target;
    } else if (e.srcElement) {
        targ = e.srcElement;
    }

    if (targ.nodeType == 3) {
        targ = targ.parentNode;
    }
    return targ;
}

function getclass(elem) {
    if (elem) {
        if (typeof(elem.className) != "undefined") {
            return (elem.className);
        } else {
            return (elem.getAttribute("class"));
        }
    }
    return (null);
}

function setclass(elem, classname) {
    if (elem) {
        if (typeof(elem.className) != "undefined") {
            elem.className = classname;
        } else {
            elem.setAttribute("class", classname);
        }
    }
} 

function addclass(elem, className) {
    var elemclass = getclass(elem);
    if (elemclass != null) {
        if (elemclass.indexOf(className) == -1) {
            var res = elemclass += " " + className;
            setclass(elem, res.trim());
        }
    }
}

function removeclass(elem, className) {
    if (elem && className) {
        var reg = new RegExp("(?:^|\s)" + className + "(?!\S)", 'g');
        var elemclass = getclass(elem);
        if (elemclass != null) {
            var res = elemclass.replace(className, '');
            setclass(elem, res);
        }
    } 
}

function parentHasId(node, idlist) {
    if (!node) {
        return(null);
    }
    if (node.id) {
        for (var i = 0 ; i < idlist.length; i++) {
            if (node.id == idlist[i]) {
                return(node.id);
            }
        }
    } else {
        return parentHasId(node.parentNode, idlist);
    }
}

function dispevent(elem, ev, details) {
    var e;
    if (typeof(elem.addEventListener) != "undefined") {
        e = new CustomEvent(ev, details);
    } else if (typeof(elem.attachEvent) != "undefined") {
        e = new CustomEvent("on" + ev, details);
    }
    elem.dispatchEvent(e);
}

function addevent(elem, ev, fct) {
    if (typeof(elem.addEventListener) != "undefined") {
        elem.addEventListener(ev, fct, false);
    } else if (typeof(elem.attachEvent) != "undefined") {
        elem.attachEvent("on" + ev, fct);
    }
}

function remevent(elem, ev, fct) {
    if (typeof(elem.removeEventListener) != "undefined") {
        elem.removeEventListener(ev, fct);
    } else if (typeof(elem.detachhEvent) != "undefined") {
        elem.detachEvent("on" + ev, fct);
    }
}

function Request(beforeRequest, requestRunning, localError, requestReturn, endRequest) {
    this.xmlhttp = getXhr();
    this.xmlhttp.wrapper = this;
    this.orsc = orsc;
    addevent(this.xmlhttp, "readystatechange", this.orsc);

    this.beforeRequest  = (typeof(beforeRequest)    == "function") ? beforeRequest  : defunc;
    this.requestRunning = (typeof(requestRunning)   == "function") ? requestRunning : defunc;
    this.localError     = (typeof(localError)       == "function") ? localError     : defunc;
    this.requestReturn  = (typeof(requestReturn)    == "function") ? requestReturn  : defunc;
    this.endRequest     = (typeof(endRequest)       == "function") ? endRequest     : defunc;

    this.send = function (method, querystring, async) {
        this.beforeRequest();
        this.xmlhttp.open(method, querystring, (async != false) ? true : false);
        this.xmlhttp.send();
    }

    function orsc () {
        var response;
        var jsonResponse;
        var wrapper = this.wrapper;

        if (this.readyState != 4 ||  this.status != 200) {
            wrapper.requestRunning();
            return;
        }

        wrapper.endRequest();

        response = this.responseText;

        try {
            jsonResponse = JSON.parse(response);
        } catch(e) {
            wrapper.localError();
            return;
        }

        wrapper.requestReturn(jsonResponse);
    }

    function defunc() {
        return;
    }
}

function Item(menuItem, id, open, close) {
    var self = this;
    this.menuItem = menuItem;
    this.userOpen = open;
    this.userClose = close
    this.open = persoOpen;
    this.close = persoClose;
    this.closed = false;

    addevent(document.getElementById(id), "click", function(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        self.menuItem.manageclick(parentHasId(target, ['menu_title', 'seek_title', 'friends_title', 'places_title']));
    });

    function persoOpen() {
        this.closed = false;
        this.userOpen();
    }

    function persoClose() {
        this.closed = true;
        this.userClose();
    }
}

function ItemMenu() {
    this.items = {};
    this.addItem = addItem;
    this.manageclick = manageclick;
    function addItem (id, open, close) {
        var item = new Item(this, id, open, close);
        this.items[id] = item;
    }

    function manageclick(id) {
        if (id == null) {
            return;
        }
        var ouverture = this.items[id].closed;
        for (var e in this.items) {
            var item = this.items[e];
            if (e == id) {
                if (ouverture == true) {
                    item.open();
                } else {
                    item.close();
                }
           /* } else {
                if (ouverture == true) {
                    item.close();
                }*/
            }
        }
    }
}

var itemMenu = itemMenu || new ItemMenu();

function openGlobalItem (e) {
    document.getElementById("menu_title").innerHTML = "Social";
    show(document.getElementById("menu_list"));
    return;
}
function openSeekItem () {
    show(document.getElementById("seek_box"));
    return;
}
function openFriendsItem () {
    show(document.getElementById("friends_list"));
    return;
}
function openPlacesItem () {
    show(document.getElementById("places_list"));
    return;
}
function closeGlobalItem () {
    document.getElementById("menu_title").innerHTML = "=";
    hide(document.getElementById("menu_list"));
    return;
}
function closeSeekItem () {
    hide(document.getElementById("seek_box"));
    return;
}
function closeFriendsItem () {
    hide(document.getElementById("friends_list"));
    return;
}
function closePlacesItem () {
    hide(document.getElementById("places_list"));
    return;
}


function initMenu() {
    itemMenu = itemMenu || new ItemMenu();
    itemMenu.addItem('menu_title', openGlobalItem, closeGlobalItem);
    itemMenu.addItem('seek_title', openSeekItem, closeSeekItem);
    itemMenu.addItem('friends_title', openFriendsItem, closeFriendsItem);
    itemMenu.addItem('places_title', openPlacesItem, closePlacesItem);
} 

//addevent(window, "load", initMenu);

/******/



var xmlhttp = getXhr();

xmlhttp.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttp.readyState != 4 ||  xmlhttp.status != 200) {
        return;
    }

    response = xmlhttp.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        hide(document.getElementById('seek_running'));
        show(document.getElementById('seek_error'));
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        hide(document.getElementById('seek_running'));
        document.getElementById('seek_error_msg').innerHTML = jsonResponse.error;
        show(document.getElementById('seek_error'));
        return;
    }

    document.getElementById('seek_search').innerHTML = jsonResponse.recherche;
    document.getElementById('seek_name').innerHTML = jsonResponse.name;
    document.getElementById('seek_mail').innerHTML = jsonResponse.mail;
    hide(document.getElementById('seek_running'));
    show(document.getElementById('seek_result'));
} 

function seek_friend_action() {
    var seek = document.getElementById('seek_friend_input').value;

    hide(document.getElementById('seek_result'));
    hide(document.getElementById('seek_error'));
    show(document.getElementById('seek_running'));
    xmlhttp.open("GET", "lookforfriend/" + seek, true);
    xmlhttp.send();
}

function insert_friend(name) {
    var matrice = document.getElementById('fl_matrice');
    
    var nfriend = matrice.cloneNode(true);
    nfriend.id = "li_" + name;
    nfriend.getElementsByTagName('span')[0].innerHTML = name;
    matrice.parentNode.appendChild(nfriend);
    show(nfriend);
}

var xmlhttpfl = getXhr();

xmlhttpfl.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttpfl.readyState != 4 ||  xmlhttpfl.status != 200) {
        return;
    }

    response = xmlhttpfl.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        hide(document.getElementById('fl_running'));
        show(document.getElementById('fl_error'));
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        hide(document.getElementById('fl_running'));
        document.getElementById('fl_error_msg').innerHTML = jsonResponse.error;
        show(document.getElementById('fl_error'));
        return;
    }

    var matrice = document.getElementById('fl_matrice');

    hide(matrice);

    for (var e in jsonResponse) {
        insert_friend(jsonResponse[e].name);
        update_friends_place_list(e, jsonResponse[e].name);
    }

    hide(document.getElementById('fl_running'));
    show(document.getElementById('fl_result'));
}

function update_friend_list() {
    show(document.getElementById('fl_running'));
    xmlhttpfl.open("GET", "getfriendlist/", true);
    xmlhttpfl.send();
}

var xmlhttprf = getXhr();

xmlhttprf.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttprf.readyState != 4 ||  xmlhttprf.status != 200) {
        return;
    }

    response = xmlhttprf.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        return;
    }

    var elem = document.getElementById('li_' + jsonResponse.name);

    elem.parentNode.removeChild(elem);
}

function send_rem_friend(friend) {
    xmlhttprf.open("DELETE", "removefriend/" + friend, true);
    xmlhttprf.send();
}

function del_friend(name) {
    if (name == "") {
        return;
    }

    send_rem_friend(name);
}

function rem_friend(e) {
    var name = "";
    var str = e.target.parentNode.parentNode.id;

    name = str.substr(str.indexOf('_') + 1, str.length);

    del_friend(name)
}

var xmlhttpaf = getXhr();

xmlhttpaf.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttpaf.readyState != 4 ||  xmlhttpaf.status != 200) {
        return;
    }

    response = xmlhttpaf.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        return;
    }

    insert_friend(jsonResponse.name);
}

function send_add_friend(friend) {
    xmlhttpaf.open("POST", "addfriend/" + friend, true);
    xmlhttpaf.send();
}

function add_friend() {
    var friend = document.getElementById('seek_name').innerHTML;
    send_add_friend(friend);
}


function update_menu() {
    update_friend_list();
//    update_address_list();
    update_place_list();
}

function client_connect() {
}

function update_header() {
}

function update_all() {
    update_menu();
    update_header();
}


/* Screen */
function getScreen() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = (typeof(w.innerWidth) != "undefined") ? w : ((typeof(e.clientWidth) != "undefined") ? e : g);

    return x;
}

function getScreenWidth() {
    var s = getScreen();

    return s.innerWidth || s.clientWidth;
}

function getScreenHeight() {
    var s = getScreen();

    return s.innerHeight || s.clientHeight;
}

function updateMapWidth() {
    var mapContainer = document.getElementById("map");

    var width = getScreenWidth();
    mapContainer.style.width = width - 7 + "px";
}


function updateMapHeight() {
    var mapContainer = document.getElementById("map");

    var height = getScreenHeight();
    mapContainer.style.height = height - 60 + "px";
}

function updateMenuHeight() {
    var menu = document.getElementById("menu");

    var height = getScreenHeight();
    menu.style.maxHeight = height - 120 + "px";
}

function updateScreenSize() {
    updateMapHeight();
    updateMapWidth();
    updateMenuHeight();
}

addevent(getScreen(), "resize", updateScreenSize);
addevent(window, "load", updateScreenSize);

/* MAP OpenStreetMap */

var lastclick = {};
var currentInterest = undefined;

function moveInterest(action, arg1) {
    if (action === "click") {
        var pinme = document.getElementById("pinme").cloneNode(true);
        show(pinme);
        if (currentInterest == undefined) {
            currentInterest = L.marker([arg1.lat, arg1.lng]).addTo(map)
                .bindPopup(pinme)
                .openPopup();
        } else {
            currentInterest.setLatLng(arg1)
                .bindPopup(pinme)
                .openPopup();
        }
    }
}

function mapClickConfirmed() {
    moveInterest("click", lastclick.latlng);
    lastclick = {};
}

function mapClick(e) {
    if (lastclick.timeout != undefined) {
        clearTimeout(lastclick.timeout);
        lastclick.timeout = undefined;
        return;
    }
    lastclick.latlng = e.latlng;
    lastclick.timeout = setTimeout(mapClickConfirmed, 500);
}

var map = undefined;

function setupMap() {
    map = L.map('map').setView([48.853, 2.35], 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
//    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | libjs : leaflet',
            maxZoom: 18
        }).addTo(map);

    map.on('click', mapClick);
}


addevent(window, "load", setupMap);

/* Pin adresses actions */


var xmlhttpap = getXhr();

xmlhttpap.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttpap.readyState != 4 ||  xmlhttpap.status != 200) {
        return;
    }

    response = xmlhttpap.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        alert("Error : " + jsonResponse.error);
        return;
    }

    update_place_list();
}

function send_add_place(name, lat, lng) {
    xmlhttpap.open("POST", "addplace/" + name + "/" + lat + "/" + lng, true);
    xmlhttpap.send();
}

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

var xmlhttprp = getXhr();

xmlhttprp.onreadystatechange = function() {
    var response;
    var jsonResponse;

    if (xmlhttprp.readyState != 4 ||  xmlhttprp.status != 200) {
        return;
    }

    response = xmlhttprp.responseText;

    try {
        jsonResponse = JSON.parse(response);
    } catch(e) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        alert("Error : " + jsonResponse.error);
        return;
    }

    var elem = document.getElementById('li_' + jsonResponse.name);

    update_place_list();
//    elem.parentNode.removeChild(elem);
}

function send_rem_place(name, lat, lng) {
    xmlhttprp.open("DELETE", "removeplace/" + name + "/" + lat + "/" + lng, true);
    xmlhttprp.send();
}

function del_place(name, lat, lng) {
    send_rem_place(name, lat, lng);
}

function rem_place(e) {
    var node = e.target.parentNode;
    var spans = node.getElementsByTagName('span');
    var name = spans[0].innerHTML;
    var lat = spans[1].innerHTML;
    var lng = spans[2].innerHTML;

    del_place(name, lat, lng)
}

var pins = {};


function pin_place(name, lat, lng, opt) {
    console.log("name : " + name + " lat : " + lat + " lng : " + lng);
    if (pins[name + lat + lng] != undefined) {
        return;
    }

    if (typeof opt == "string") {
        var myIcon = L.divIcon({size:"20px", html:"<p>" + name + "</p>"});
        var marker = L.marker([lat, lng], {draggable:false, icon: myIcon});
    } else {
        var marker = L.marker([lat, lng], {draggable:false});
    }
    map.addLayer(marker);
    marker.bindPopup(name);
    pins[name + lat + lng] = marker;
}

function req_before_friends_place_list() {
/*    show(document.getElementById('al_running'));*/
}

function local_err_friends_place_list () {
/*    document.getElementById('al_error_msg').innerHTML = "Technical";
    show(document.getElementById('al_error'));*/
}

function req_return_friends_place_list(jsonResponse) {

    if (jsonResponse == null) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
/*        document.getElementById('al_error_msg').innerHTML = jsonResponse.error;
        show(document.getElementById('al_error'));*/
        return;
    }

    var matrice = document.getElementById('fpl_matrice');

    hide(matrice);

    for (var e in jsonResponse) {
        if (jsonResponse[e].places != null) { 
            friendsplaces.merge(jsonResponse[e].places);
        }
    }
/*    show(document.getElementById('al_result'));   */
}

function req_end_friends_place_list() {
/*    hide(document.getElementById('al_running'));*/
}


var req_friends_place_list = new Request(
        req_before_friends_place_list,
        null,
        local_err_friends_place_list,
        req_return_friends_place_list,
        req_end_friends_place_list
        );

function update_friends_place_list(id, name) {
    req_friends_place_list.send("GET", "getfriendplacelist/" + id + "/" + name, false);
}


function req_before_place_list() {
    show(document.getElementById('al_running'));
}

function local_err_place_list () {
    document.getElementById('al_error_msg').innerHTML = "Technical";
    show(document.getElementById('al_error'));
}

function req_return_place_list(jsonResponse) {
    if (jsonResponse == null) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        document.getElementById('al_error_msg').innerHTML = jsonResponse.error;
        show(document.getElementById('al_error'));
        return;
    }

    var matrice = document.getElementById('al_matrice');

    hide(matrice);

    places.refresh(jsonResponse);

    show(document.getElementById('al_result'));   
}

function req_end_place_list() {
    hide(document.getElementById('al_running'));
}

var req_place_list = new Request(
        req_before_place_list,
        null,
        local_err_place_list,
        req_return_place_list,
        req_end_place_list
        );

function update_place_list() {
    req_place_list.send("GET", "getplacelist");
}

function List(node) {
    this.listener = node || window;
    this.list = {};
    this.listold = {};
    this.markupdate = 0;
    this.refresh = refresh;
    this.merge = merge;
    this.add = add;
    this.remove = remove;

    function refresh(list) {
        for(var e in list) {
            if (this.list[e] == undefined) {
                this.add(e, list[e]);
            }
            this.list[e].markupdate = (!this.markupdate);
        }

        for (var e in this.list) {
            if (this.list[e].markupdate == this.markupdate) {
                this.remove(e);
            }
        }

        this.markupdate = !this.markupdate;
    }

    function merge(list) {
        for(var e in list) {
            if (this.list[e] == undefined) {
                this.add(e, list[e]);
            }
        }
    }

    function add(e, elem) {
        this.list[e] = elem;
        dispevent(this.listener, "listadd", {'detail' : this.list[e] });
    }

    function remove(e, elem) {
        this.listold[e] = this.list[e];
        this.list[e] = undefined;
        dispevent(this.listener, "listdel", {'detail' : this.listold[e] });
    }
}

var places = undefined;
var friends = undefined;
var friendsplaces = undefined;

function new_place_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = elem.lat;
    var lng = elem.lng;
    var matrice = document.getElementById('al_matrice');
    var nplace = matrice.cloneNode(true);
    var spans = nplace.getElementsByTagName('span');
    

    nplace.id = "li_" + name + "_" + lat + "_" + lng;
    spans[0].innerHTML = name;
    spans[1].innerHTML = lat;
    spans[2].innerHTML = lng;
    matrice.parentNode.appendChild(nplace);
    show(nplace);
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

function old_place_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = elem.lat;
    var lng = elem.lng;

    var node = document.getElementById("li_" + name + "_" + lat + "_" + lng);
    node.parentNode.removeChild(node);
}

function old_place_map(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = elem.lat;
    var lng = elem.lng;

    map.removeLayer(pins[name + lat + lng]);
    pins[name + lat + lng] = undefined;
}

function new_friend_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var matrice = document.getElementById('fl_matrice');
    var nplace = matrice.cloneNode(true);
    var spans = nplace.getElementsByTagName('span');
    
    nplace.id = "li_" + name;
    spans[0].innerHTML = name;
    matrice.parentNode.appendChild(nplace);
    show(nplace);
    update_friends_place_list(id, name);
}

function old_friend_list(ev) {
    var elem = ev.detail;
    var name = elem.name;

    var node = document.getElementById("li_" + name);
    node.parentNode.removeChild(node);
}


function initList() {
    var pl = document.getElementById("places_list");
    var fl = document.getElementById("friends_list");
    var fpl = document.getElementById("friends_places_list");
    places = new List(pl);
    friends = new List(fl);
    friendsplaces = new List(fpl);
    addevent(places.listener, "listadd", new_place_list);
    addevent(places.listener, "listadd", new_place_map);
    addevent(places.listener, "listdel", old_place_list);
    addevent(places.listener, "listdel", old_place_map);
    addevent(friends.listener, "listadd", new_friend_list);
    addevent(friends.listener, "listdel", old_friend_list);
    addevent(friendsplaces.listener, "listadd", new_friend_place_map);
    addevent(friendsplaces.listener, "listdel", old_place_map);
}

//addevent(window, "load", initList);

