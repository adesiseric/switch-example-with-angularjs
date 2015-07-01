(function () {

    'use strict';

    function Switch ($log) {

        return {
            restrict: 'EA',
            scope: {
                value: '=ngModel'
            },
            templateUrl: 'directives/switch/switch.tpl.html',
            link: function (scope, elem, attrs) {

                function getValue() {
                    if ( scope.value === undefined ) {
                        scope.value = false;
                    }

                    switchText();
                }

                function switchText() {
                    scope.text = scope.value ? 'Si' : 'No';
                }

                scope.toggle = function() {
                    scope.value = !scope.value;
                    switchText();
                };

                getValue();

            }
        };

    }

    angular.module('switchApp')
    .directive('switch', Switch);

})();