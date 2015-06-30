import moment from 'moment';

import mapTemplate from './map.html!text';
import mapController from './map-controller';

export default function routes($stateProvider) {

  return $stateProvider
    .state('home.map', {
      url: '/map?month&year&classification&status',
      template: mapTemplate,
      controller: mapController,
      controllerAs: 'ctrl',
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
    });
}

routes.$inject = ['$stateProvider'];
