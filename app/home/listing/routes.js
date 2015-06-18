import moment from 'moment';

import listingTemplate from './listing.html!text';
import listingController from './listing-controller';

export default function routes($stateProvider) {

  return $stateProvider
    .state('home.listing', {
      url: '/listing?month&year&state',
      template: listingTemplate,
      controller: listingController,
      controllerAs: 'ctrl',
      // Default parameters in case query string isn't set
      params: {
        month: '' + moment().month(),
        year: '' + moment().year(),
        listing: null
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
        recallsByState: ['foodRecallService', 'startDate', 'endDate',
          (foodRecallService, startDate, endDate) => {
            return foodRecallService.getRecallsByState(startDate, endDate);
          }
        ],
        states: ['foodRecallService',
          (foodRecallService) => {
            return foodRecallService.createStateList();
          }
        ]
      }
    });
}

routes.$inject = ['$stateProvider'];
