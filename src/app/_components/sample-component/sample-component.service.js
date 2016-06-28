(function(){
    'use strict';

    /**
     *
     * Should content component service function
     *
     */

    angular
        .module('app.components.sample-component')
        .factory('utils', function(){
            var exports = {
                someMethod: function(){
                    return 'It work\'s';
                }
            };

            return exports;
        });
})();
