
var places = undefined;
var friends = undefined;
var seekplaces = undefined;

function initList() {
    var pl = document.getElementById("places_list");
    var fl = document.getElementById("friends_list");
    var spl = document.getElementById("seek_place_box");
    seekplaces = new List(spl);
    places = new List(pl);
    friends = new List(fl);
    addevent(places.listener, "listadd", new_place_list);
    addevent(places.listener, "listadd", new_place_map);
    addevent(places.listener, "listdel", old_place_list);
    addevent(places.listener, "listdel", old_place_map);
    addevent(friends.listener, "listadd", new_friend_list);
    addevent(friends.listener, "listdel", old_friend_list);
//    addevent(friends.listener, "listadd", new_friend_place_map);
//    addevent(friends.listener, "listdel", old_place_map);
    addevent(seekplaces.listener, "listadd", new_seek_place_list);
    addevent(seekplaces.listener, "listdel", old_seek_place_list);
}


