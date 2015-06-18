import angular from 'angular';
import usMap from './us-map/directive';

export default angular.module('fdaFoodRecalls.directives', [])
  .directive(usMap.directiveName, usMap.directiveFactory);
