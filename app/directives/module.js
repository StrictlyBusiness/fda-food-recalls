import angular from 'angular';
import stateMap from './state-map';

export default angular.module('fdaFoodRecalls.directives', [])
  .directive(stateMap.directiveName, stateMap.directiveFactory);
