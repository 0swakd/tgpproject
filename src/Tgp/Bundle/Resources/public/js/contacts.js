(function() {
    var contacts = angular.module("contacts", [ ], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });

    contacts.controller("ContactsController", [ '$scope','$http', function($scope,$http) {
        var contacts = this;
        contacts.list = [];

        $http.get("/contacts").success(function(data) {
            contacts.list = data;
        });
    }]);
})();
