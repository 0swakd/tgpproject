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
        self.menuItem.manageclick(parentHasId(target, ['menu_title', 'seek_place_title', 'seek_title', 'geoloc_title', 'friends_title', 'places_title']));
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


