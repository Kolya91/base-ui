(function () {
    'use strict';

    angular
        .module('app.main')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.main', {
                    url: "/main",
                    views: {
                        'content@app': {
                            templateUrl: "app/main/main.template.html",
                            controller: "MainController",
                            controllerAs: "main"
                        }
                    }
                });
        });
})();
