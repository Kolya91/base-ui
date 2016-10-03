(function(){
    'use strict';

    angular
        .module('app.components')
        .factory('ls', function($window, $q, $state){
            function _set(key, value) {
                try {
                    $window.localStorage.setItem(key, JSON.stringify(value));
                } catch (e) {
                    console.warn('Can\'t write data to local storage');
                }
            }

            function _get(key) {
                var users;

                try {
                    users = JSON.parse($window.localStorage.getItem(key));
                } catch (e) {
                    console.warn('Unable to read users due to', e);
                }

                return users || [];
            }
            var exports = {
                set: function(details){
                    var users = _get('users') || [];
                    var userExist = _.find(users, { 'email': details.email });
                    if (userExist) {
                        return $q.reject('User ' + details.email + ' already exists');
                    }
                    users.push(details);
                    _set('users', users);
                    return $q.resolve(details);
                },

                authorize: function(details){
                    _set('auth', details.email);
                },

                unauthorize: function(){
                    _set('auth', '');
                    return $q.resolve('Unauthorized');
                },

                getAuth: function(){
                    return !!_get('auth').length;
                },

                get: function(email){
                    var userByEmail;
                    var users = _get('users') || [];

                    if (email) {
                        userByEmail = _.find(users, { 'email': email });
                        if (!userByEmail) {
                            return $q.reject('User ' + email + ' not found');
                        }

                        return $q.resolve(userByEmail);
                    }

                    return users;
                }
            };
            return exports;
        });
})();
