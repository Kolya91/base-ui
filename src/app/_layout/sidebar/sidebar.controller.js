(function(){
    'use strict';

    angular
        .module('app.layout.sidebar')
        .controller('SidebarController', function($state, auth){
            var vm = this;

            vm.logout = function(){
                return auth.logout()
                    .then(function(){
                        return $state.go('app.login');
                    });
            }
        });
})();
