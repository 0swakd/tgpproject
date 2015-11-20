


/* Impression de l'ajout ou du retrait d'un ami dans la liste du menu */

function new_friend_list(ev) {
    var elem = ev.detail;
    var name = elem.name;
    var id = elem.id;
    var matrice = document.getElementById('fl_matrice');
    var nplace = matrice.cloneNode(true);
    var spans = nplace.getElementsByTagName('span');
    
    nplace.id = "li_" + name;
    spans[0].innerHTML = name;
    matrice.parentNode.appendChild(nplace);
    show(nplace);
    update_friends_place_list(id, name, true);
}

function old_friend_list(ev) {
    var elem = ev.detail;
    var name = elem.name;

    var node = document.getElementById("li_" + name);
    node.parentNode.removeChild(node);
}


/*========== GET SEEK FRIEND =============*/

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
    xmlhttp.open("GET", "friend/search/" + seek, true);
//    xmlhttp.open("GET", "lookforfriend/" + seek, true);
    xmlhttp.send();
}

function insert_friend(friend) {
    friends.add(friend.id, friend);
}



/*========== GET FRIEND LIST =============*/


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
        insert_friend(jsonResponse[e]);
        update_friends_place_list(e, jsonResponse[e]);
    }

    hide(document.getElementById('fl_running'));
    show(document.getElementById('fl_result'));
}

function update_friend_list() {
    show(document.getElementById('fl_running'));
    xmlhttpfl.open("GET", "friend/", true);
    xmlhttpfl.send();
}


/*========== REMOVE FRIEND =============*/

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

    remove_friend(jsonResponse.id);
}

function remove_friend(id) {
    friends.remove(id);
}

function send_rem_friend(friend) {
    xmlhttprf.open("DELETE", "friend/" + friend, true);
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



/*========== ADD FRIEND =============*/


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

    insert_friend(jsonResponse);
}

function send_add_friend(friend) {
    xmlhttpaf.open("POST", "friend/" + friend, true);
    xmlhttpaf.send();
}

function add_friend() {
    var friend = document.getElementById('seek_name').innerHTML;
    send_add_friend(friend);
}




/*========== GET FRIEND PLACE LIST =============*/


/* Gestion Liste locale */

/* Gestion Ajax */
function req_before_friends_place_list() {
}

function local_err_friends_place_list () {
}

function req_return_friends_place_list(jsonResponse) {

    if (jsonResponse == null) {
        return;
    }

    if (typeof(jsonResponse.error) == "string") {
        return;
    }

    var matrice = document.getElementById('fpl_matrice');

    hide(matrice);

    for (var e in jsonResponse) {
        if (jsonResponse[e].places != null) { 
            friendsplaces.merge(jsonResponse[e].places);
        }
    }

    if (placefriendqueue != undefined) {
        placefriendqueue.run();
    }
}

function req_end_friends_place_list(queue) {
}

var req_friends_place_list = new Request(
        req_before_friends_place_list,
        null,
        local_err_friends_place_list,
        req_return_friends_place_list,
        req_end_friends_place_list
        );

function queue_friend_place(params) {
    req_friends_place_list.send(params.method, params.query, true);
}

var placefriendqueue = undefined;

function update_friends_place_list(id, name, prio) {
    if (placefriendqueue == undefined) {
        placefriendqueue = new Queue();
    }

    if (prio == true) {
        placefriendqueue.addFirst(queue_friend_place, {method:"GET", query:"place/friend/" + id + "/" + name});
    } else {
        placefriendqueue.add(queue_friend_place, {method:"GET", query:"place/friend/" + id + "/" + name});
    }
}


