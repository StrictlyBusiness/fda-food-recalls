import mapTemplate from './map.html!text';
import mapController from './map-controller';

export default function routes($stateProvider) {

  return $stateProvider
    .state('home.map', {
      url: '/map',
      template: mapTemplate,
      controller: mapController,
      controllerAs: 'ctrl',
      resolve: {
        recallResults: ['openFdaService', (openFdaService) =>
          openFdaService.query({
            search: 'report_date:[20150101 TO 20150131]',
            limit: 100
          })
        ]
      }
    });
}

routes.$inject = ['$stateProvider'];
