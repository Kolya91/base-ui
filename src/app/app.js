(function() {
    'use strict';

    var appDependencies = [
        'ui.router',
        'ui-notification',
        'app.layout',
        'app.components',
        'app.main',
        'app.login',
        'app.signup'
    ];
    angular.module('app', appDependencies); // TODO: change application name to project name
})();
