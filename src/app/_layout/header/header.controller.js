(function(){
    'use strict';

    angular
        .module('app.layout.header')
        .controller('HeaderController', function($state, auth){
            var vm = this;

            vm.logout = function(){
                return auth.logout()
                    .then(function(){
                        return $state.go('app.login');
                    });
            }
        });
})();
