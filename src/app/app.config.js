(function () {
    'use strict';

    angular
        .module('app')
        .config(function ($stateProvider) {
            $stateProvider.state('app', {
                abstract: true,
                views: {
                    header: {
                        templateUrl: 'app/_header/header.template.html',
                        controller: 'HeaderController'
                    },
                    footer: {
                        templateUrl: 'app/_footer/footer.template.html'
                    }
                }
            });
        });
})();
