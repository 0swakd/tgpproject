
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

function getTarget(e) {
    var targ;

    var ev = e | window.event;

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



function getDisplayAddress(jsonObj) {
    var ret = "";
    if (typeof jsonObj == "object") {
        if (typeof jsonObj.address == "object") {
            var address = jsonObj.address;
            /* TODO ameliorer tout ca */
            if (typeof address.house_number == "string" && typeof address.road == "string" && typeof address.city == "string" && typeof address.postcode == "string") {
                ret = address.house_number + " " + address.road + " " + address.city + " (" + address.postcode + ")";
            } else if (typeof address.road == "string" && typeof address.city == "string" && typeof address.postcode == "string") {
                ret = address.road + " " + address.city + " (" + address.postcode + ")";
            } else if (typeof address.suburb == "string" && typeof address.city == "string" && typeof address.postcode == "string") {
                ret = address.suburb + " " + address.city + " (" + address.postcode + ")";
            } else if (typeof address.suburb == "string" && typeof address.village == "string" && typeof address.postcode == "string") {
                ret = address.suburb + " " + address.village + " (" + address.postcode + ")";
            }
        } 
        
        if (ret == "" && typeof jsonObj.display_name == "string") {
            ret = jsonObj.display_name;
        }
    }

    if (ret == "") {
        ret = "Error init";
    }
    return(ret);
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

