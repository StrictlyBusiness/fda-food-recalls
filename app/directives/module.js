import angular from 'angular';
import usMap from './us-map/directive';
import recallsList from './recalls-list/directive';
import recallCard from './recall-card/directive';

export default angular.module('fdaFoodRecalls.directives', [])
  .directive(recallsList.directiveName, recallsList.directiveFactory)
  .directive(recallCard.directiveName, recallCard.directiveFactory)
  .directive(usMap.directiveName, usMap.directiveFactory);
