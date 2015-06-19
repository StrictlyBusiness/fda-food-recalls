import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import Promise from 'bluebird';

import configModule from './app-config';
import directivesModule from './directives/module';
import servicesModule from './services/module';
import filtersModule from './filters/module';

import homeModule from './home/module';

let dependencies = [
  // Third party modules
  'ui.router',
  'ui.bootstrap',

  // Project based code services
  configModule.name,
  directivesModule.name,
  servicesModule.name,
  filtersModule.name,

  // Page based modules
  homeModule.name
];

export default angular.module('fdaFoodRecalls', dependencies)

.config(['$compileProvider', ($compileProvider) => {
  $compileProvider.debugInfoEnabled(true);
}])

.run(['$rootScope', ($rootScope) => {
  // This will synchronize bluebird promise queue flushing with angulars queue flushing
  // Angular is also now responsible for choosing the actual scheduler
  Promise.setScheduler((fn) => {
    $rootScope.$evalAsync(fn);
  });
}])

.run(['$rootScope', '$log', ($rootScope, $log) => {

  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
    $log.debug('$stateChangeStart to ' + toState.name + '- fired when the transition begins.',
      '\n  event: ', event,
      '\n  toState: ', toState,
      '\n  toParams: ', toParams,
      '\n  fromState: ', fromState,
      '\n  fromParams: ', fromParams);
  });

  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    $log.error('$stateChangeError ' + toState.name + ' - fired when an error occurs during transition.',
      '\n  event: ', event,
      '\n  toState: ', toState,
      '\n  toParams: ', toParams,
      '\n  fromState: ', fromState,
      '\n  fromParams: ', fromParams,
      '\n  error: ', error);

    debugger; // eslint-disable-line no-debugger
  });

  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    $log.debug('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.',
      '\n  event: ', event,
      '\n  toState: ', toState,
      '\n  toParams: ', toParams,
      '\n  fromState: ', fromState,
      '\n  fromParams: ', fromParams);
  });

  $rootScope.$on('$stateChangeCancel', (event, toState, toParams, fromState, fromParams) => {
    $log.debug('$stateChangeCancel to ' + toState.name + '- fired when state transition is cancelled.',
      '\n  event: ', event,
      '\n  toState: ', toState,
      '\n  toParams: ', toParams,
      '\n  fromState: ', fromState,
      '\n  fromParams: ', fromParams);
  });

  $rootScope.$on('$viewContentLoaded', (event) => {
    $log.debug('$viewContentLoaded - fired after dom rendered', event);
  });

  $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams) => {
    $log.error('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.',
      '\n  event: ', event,
      '\n  unfoundState: ', unfoundState,
      '\n  fromState: ', fromState,
      '\n  fromParams: ', fromParams);
  });
}]);
