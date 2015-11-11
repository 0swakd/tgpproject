
function updateMenuHeight() {
    var menu = document.getElementById("menu");

    var height = getScreenHeight();
    menu.style.maxHeight = height - 120 + "px";
}

var menuRight = menuRight || new ItemMenu();

function openGlobalItem (e) {
    show(document.getElementById("menu_list"));
    return;
}
function openSeekItem () {
    show(document.getElementById("seek_box"));
    return;
}
function openSeekPlaceItem () {
    show(document.getElementById("seek_place_box"));
    return;
}
function openGeolocItem () {
    show(document.getElementById("geoloc_box"));
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
    hide(document.getElementById("menu_list"));
    return;
}
function closeSeekItem () {
    hide(document.getElementById("seek_box"));
    return;
}
function closeSeekPlaceItem () {
    hide(document.getElementById("seek_place_box"));
    return;
}
function closeGeolocItem () {
    hide(document.getElementById("geoloc_box"));
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

function updateMenu() {
    update_friend_list();
    update_place_list();
}

function initMenu() {
    menuRight = menuRight || new ItemMenu();
    menuRight.addItem('menu_title', openGlobalItem, closeGlobalItem);
    menuRight.addItem('seek_place_title', openSeekPlaceItem, closeSeekPlaceItem);
    menuRight.addItem('geoloc_title', openGeolocItem, closeGeolocItem);
    menuRight.addItem('seek_title', openSeekItem, closeSeekItem);
    menuRight.addItem('friends_title', openFriendsItem, closeFriendsItem);
    menuRight.addItem('places_title', openPlacesItem, closePlacesItem);
    updateMenu();
} 

addevent(window, "load", initMenu);

