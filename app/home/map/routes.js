import mapTemplate from './map.html!text';
import mapController from './map-controller';

export default function routes($stateProvider) {

  return $stateProvider
    .state('home.map', {
      url: '/map',
      template: mapTemplate,
      controller: mapController,
      controllerAs: 'ctrl'
    });
}

routes.$inject = ['$stateProvider'];
