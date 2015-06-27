import angular from 'angular';
import usMap from './us-map/directive';
import recallsList from './recalls-list/directive';

export default angular.module('fdaFoodRecalls.directives', [])
  .directive(recallsList.directiveName, recallsList.directiveFactory)
  .directive(usMap.directiveName, usMap.directiveFactory);
