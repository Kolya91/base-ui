(function () {
    'use strict';

    angular
        .module('app.layout')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/main');

            $stateProvider.state('app', {
                abstract: true,
                views: {
                    '@': {
                        templateUrl: "app/_layout/layout.template.html",
                        controller: "LayoutController"
                    },
                    'sidebar@app': {
                        templateUrl: 'app/_layout/sidebar/sidebar.template.html'
                    }
                }
            });
        });
})();
