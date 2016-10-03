(function(){
    'use strict';

    angular
        .module('app.components')
        .factory('auth', function($state, $q, ls){
            var exports = {
                login: function(details){
                    /** Simple validation */
                    if (!details.email && !details.password) { return $q.reject('Credentials are required'); }
                    if (!details.email) { return $q.reject('Email address is required'); }
                    if (!details.password) { return $q.reject('Password is required'); }

                    return ls.get(details.email)
                        .then(function(user){
                            ls.authorize(user);
                        });
                },

                signup: function(details){
                    /** Simple validation */
                    if (!details.email) { return $q.reject('Email address is required'); }
                    if (!details.password) { return $q.reject('Password is required'); }
                    if (details.password.length < 6) { return $q.reject('Password is too short'); }
                    if (!details.confirmPassword) { return $q.reject('Password is required'); }
                    if (details.password !== details.confirmPassword) { return $q.reject('Password don\'t match'); }

                    return ls.set(details)
                        .then(function(user){
                            return ls.authorize(user);
                        });
                },

                logout: function(){
                    return ls.unauthorize();
                },

                isAuthorized: function(){
                    return ls.getAuth();
                }
            };
            return exports;
        })
        .run(function($rootScope, $state, auth){
            $rootScope.$on('$stateChangeStart', function(event, toState){
                if (!auth.isAuthorized() && toState.name !== 'app.login' && toState.name !== 'app.signup') {
                    event.preventDefault();
                    return $state.go('app.login');
                } else if (auth.isAuthorized() && (toState.name === 'app.login' || toState.name === 'app.signup')) {
                    event.preventDefault();
                    return $state.go('app.main');
                }
            });
        });
})();
