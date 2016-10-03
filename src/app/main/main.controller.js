(function(){
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', function(){
            var vm = this;
            vm.message = 'Great! It work\'s!'
        });
})();
