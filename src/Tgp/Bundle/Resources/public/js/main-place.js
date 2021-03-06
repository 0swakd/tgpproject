


/* Impression de l'ajout ou du retrait d'un lieu dans la liste du menu et la carte */

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


/*========== GET SEEK PLACE =============*/

/* Gestion Liste locale */
/* TODO check fonctionnel */
function new_seek_place_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = parseFloat(elem.lat).toFixed(8);
    var lng = parseFloat(elem.lng).toFixed(8);
    var matrice = document.getElementById('spl_matrice');
    var nplace = matrice.cloneNode(true);
    var spans = nplace.getElementsByTagName('span');
    

    nplace.id = "spl_" + name + "_" + lat + "_" + lng;
    spans[0].innerHTML = name;
    spans[1].innerHTML = lat;
    spans[2].innerHTML = lng;
    matrice.parentNode.appendChild(nplace);
    show(nplace);
}

function old_seek_place_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var lat = parseFloat(elem.lat).toFixed(8);
    var lng = parseFloat(elem.lng).toFixed(8);

    var node = document.getElementById("spl_" + name + "_" + lat + "_" + lng);
    node.parentNode.removeChild(node);
}

function mark_seeked_place(e) {
    var node = e.target.parentNode.parentNode;
    var spans = node.getElementsByTagName('span');
    var lat = spans[1].innerHTML;
    var lng = spans[2].innerHTML;

    moveInterest("mark", {lat:lat, lng:lng});
}

/* Gestion Ajax */

function req_before_seek_place_list() {
    show(document.getElementById('seek_place_running'));
}

function local_err_seek_place_list () {
    document.getElementById('seek_place_error_msg').innerHTML = "Technical";
    show(document.getElementById('seek_place_error'));
}

function req_return_seek_place_list(jsonResponse) {
    if (jsonResponse == null) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        document.getElementById('seek_place_error_msg').innerHTML = jsonResponse.error;
        show(document.getElementById('seek_place_error'));
        return;
    }

    var matrice = document.getElementById('spl_matrice');

    hide(matrice);

    arrayResponse = JSON.parse(jsonResponse);

    var list = {};
    var matrice = document.getElementById('spl_matrice');


    for (var e in arrayResponse) {
        var elem = {};
        var res = arrayResponse[e];
        var id = res.place_id;
        elem.lat  = res.lat;
        elem.lng  = res.lon;
        elem.name = getDisplayAddress(res);

        list[id] = elem;
    }

    seekplaces.refresh(list);

    show(document.getElementById('seek_place_result'));   
}

function req_end_seek_place_list() {
    hide(document.getElementById('seek_place_running'));
}

var req_seek_place_list = new Request(
        req_before_seek_place_list,
        null,
        local_err_seek_place_list,
        req_return_seek_place_list,
        req_end_seek_place_list
        );

function seek_place_action() {
    var seek = document.getElementById('seek_place_input').value;

    req_seek_place_list.send("GET", "place/search/" + encodeURIComponent(seek));
}


/*========== ADD PLACE =============*/

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
    xmlhttpap.open("POST", "place/" + name + "/" + lat + "/" + lng, true);
    xmlhttpap.send();
}




/*========== DELETE PLACE =============*/



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
    xmlhttprp.open("DELETE", "place/" + name + "/" + lat + "/" + lng, true);
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

function center_place_click(e) {
    var node = e.target.parentNode;
    var spans = node.getElementsByTagName('span');
    var name = spans[0].innerHTML;
    var lat = spans[1].innerHTML;
    var lng = spans[2].innerHTML;

    map.setView([lat, lng], 18);
}



/*========== GET PLACE LIST =============*/


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
    req_place_list.send("GET", "place/");
}
