

addevent(window, "load", setupMap);

function updateScreenSize() {
    updateMapHeight();
    updateMapWidth();
    updateMenuHeight();
}

addevent(getScreen(), "resize", updateScreenSize);
addevent(window, "load", updateScreenSize);


addevent(window, "load", initList);

