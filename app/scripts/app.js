(function () {

    'use strict';

    function configRouteProvider($routeProvider) {

        // Ruta, template
        var routes = [
            ['home', 'home'],
            ['404', '404']
        ];

        $routeProvider.when('/', {redirectTo: '/' + routes[0][0]});

        angular.forEach(routes, function (route) {
            $routeProvider
            .when('/' + route[0], {templateUrl: 'views/partials/' + route[1] + '.html'});
        });

        $routeProvider.otherwise({redirectTo: '/404'});

    }

    angular.module('switchApp', [
        // Angularjs core
        'ngRoute',
        // Templates
        'switchApp.templates'
    ])
    .config(configRouteProvider);

})();