
function getXhr() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

/* TODO Voir pour créer une logique composite Requeste + Queue avec un objet qui contient les requetes pour chaques ressources */
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


/* TODO Voir pour créer une logique composite Requeste + Queue avec un objet qui contient les requetes pour chaques ressources */
function Queue() {
    this.queue = [];
    this.running = 0;

    this.add = add;
    this.addFirst = addFirst;
    this.run = run;

    function add(fct, params) {
        this.queue.push({fonction:fct, parametre:params});
        if (this.running == 0) {
            this.run();
        }
    }

    function addFirst(fct, params) {
        this.queue.unshift({fonction:fct, parametre:params});
        if (this.running == 0) {
            this.run();
        }
    }

    function run() {
        var obj = this.queue.shift();
        if (obj == undefined) {
            this.running = 0;
            return;
        }
        this.running = 1;
        obj.fonction(obj.parametre, this);
    }
}

