(function () {
    'use strict';

    angular
        .module('app.login')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.login', {
                    url: "/login",
                    views: {
                        '@': {
                            templateUrl: "app/login/login.template.html",
                            controller: "LoginController",
                            controllerAs: "login"
                        }
                    }
                });
        });
})();
