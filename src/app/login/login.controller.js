(function(){
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', function($state, auth, Notification){
            var vm = this;

            vm.details = {};

            vm.login = function(){
                return auth.login(vm.details)
                    .then(function(user){
                        return $state.go('app.main');
                    })
                    .catch(function(error){
                        error = error || 'An error has occurred:(';
                        Notification.error({ message: error });
                        return $q.reject(error);
                    });
            };

            vm.loginFB = function(){
                var error = 'There no server side for Facebook login';
                Notification.error({ message: error });
                return $q.reject(error);
            };
        });
})();
