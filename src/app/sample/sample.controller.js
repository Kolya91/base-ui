(function(){
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', function(utils){
            var vm = this;
            vm.message = 'Great! It work\'s!'
        });
})();
