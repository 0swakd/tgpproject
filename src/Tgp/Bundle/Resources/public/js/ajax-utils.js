
function getXhr() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP");
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


