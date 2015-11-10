
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
            if (this.list[e] != undefined && this.list[e].markupdate == this.markupdate) {
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

