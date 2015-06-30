import moment from 'moment';

import mapTemplate from './map.html!text';
import mapController from './map-controller';

export default function routes($stateProvider) {

  return $stateProvider
    .state('home.mapData', {
      abstract: true,
      url: '/map?month&year',
      template: '<ui-view></ui-view>',
      // Default parameters in case query string isn't set
      params: {
        month: '' + moment().month(),
        year: '' + moment().year()
      },
      resolve: {
        startDate: ['$stateParams',
          ($stateParams) => moment().startOf('month')
            .month($stateParams.month - 1)
            .year($stateParams.year)
        ],
        endDate: ['startDate',
          (startDate) => startDate.clone()
            .endOf('month')
        ],
        recalls: ['foodRecallService', 'startDate', 'endDate',
          (foodRecallService, startDate, endDate) => {
            return foodRecallService.getRecallsForPeriod(startDate, endDate);
          }
        ]
      }
    })
    .state('home.map', {
      parent: 'home.mapData',
      url: '?classification&status&company&product&groupBy&countBy&state',
      template: mapTemplate,
      controller: mapController,
      controllerAs: 'ctrl',
      // Default parameters in case query string isn't set
      params: {
        classification: null,
        status: null,
        groupBy: 'origination',
        countBy: 'recalls',
        state: null
      },
      reloadOnSearch: false
    })
    ;
}

routes.$inject = ['$stateProvider'];
