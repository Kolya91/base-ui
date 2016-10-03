(function(){
    'use strict';

    angular
        .module('app.components.ui-action')
        .directive('uiAction', function($q, $timeout){
            return {
                restrict: 'A',
                compile: function(tElem, tAttr) {
                    return function (scope, elem, attrs) {
                        var promise;

                        var spinner = angular.element('<span class="glyphicon glyphicon-refresh glyphicon-spin"></span><span>&nbsp;&nbsp;</span>');
                        var success = angular.element('<span class="glyphicon glyphicon-ok"></span><span>&nbsp;&nbsp;</span>');
                        var error = angular.element('<span class="glyphicon glyphicon-remove"></span><span>&nbsp;&nbsp;</span>');

                        elem.on('click', function (e) {
                            if(promise){
                                return;
                            }

                            elem.prepend(spinner);
                            elem.addClass('disabled');

                            promise = $q.when($timeout(function(){ scope.$eval(attrs.uiAction, {$event: e}) }, 300))
                                .then(function(){
                                    elem.prepend(success);

                                    $timeout(function(){
                                        promise = null;
                                        success.remove();
                                    }, 1000);
                                })
                                .catch(function(){
                                    elem.prepend(error);

                                    $timeout(function(){
                                        promise = null;
                                        error.remove();

                                    }, 2000);
                                })
                                .finally(function(){
                                    spinner.remove();
                                    elem.removeClass('disabled');
                                });
                        });

                    }
                }
            }
        });
})();
