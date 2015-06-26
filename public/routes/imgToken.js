'use strict';

angular.module('mean.img-token').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('imgToken example page', {
            url: '/imgToken/example',
            templateUrl: 'img-token/views/index.html'
        });
    }
]);
