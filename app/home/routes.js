import homeTemplate from './home.html!text';
import HomeController from './home-controller';

export default function homeRoute($stateProvider, $urlRouterProvider) {

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise('/map');

  return $stateProvider
    .state('home', {
      url: '',
      abstract: true,
      template: homeTemplate,
      controller: HomeController,
      controllerAs: 'ctrl'
    });
}

homeRoute.$inject = ['$stateProvider', '$urlRouterProvider'];
