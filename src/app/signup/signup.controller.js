(function(){
    'use strict';

    angular
        .module('app.signup')
        .controller('SignupController', function($q, $state, auth, Notification){
            var vm = this;

            vm.details = {};

            vm.signup = function(){
                return auth.signup(vm.details)
                    .then(function(){
                        $state.go('app.main');
                    })
                    .catch(function(error){
                        error = error || 'An error has occurred:(';
                        Notification.error({ message: error });
                        return $q.reject(error);
                    });
            }
        });
})();
