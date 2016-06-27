(function() {
    'use strict';

    var appDependencies = [
        'ui.router',
        'app.header',
        'app.components.sample-component',
        'app.sample'
    ];
    angular.module('app', appDependencies); // TODO: change application name to project name
})();
