(function() {
  'use strict';

  angular
    .module('dctmFileManagerSample')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $sceDelegateProvider, $locationProvider) {

    // Browser Support?
    // if(window.history && window.history.pushState){
    //   $locationProvider.html5Mode({
    //           enabled: true,
    //           requireBase: false
    //    });
    // }

    // Trust Blob URL
    $sceDelegateProvider.resourceUrlWhitelist(['**']);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/filemanager/templates/main.html',
        controller: 'FileManagerController',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
