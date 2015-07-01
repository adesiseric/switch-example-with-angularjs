(function () {

    'use strict';

    function MainCtrl($log) {

        var model = {
            data: true,
            time: null
        };

        function changeData (data) {
            $log.info(data);
        }

        function changeTime (data) {
            $log.info('time: ', data);
        }

        angular.extend(this, {
            model: model,
            changeData: changeData,
            changeTime: changeTime
        });

    }

    angular.module('switchApp')
    .controller('MainCtrl', MainCtrl);

})();