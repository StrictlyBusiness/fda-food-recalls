import angular from 'angular';
import isRecallForState from './is-recall-for-state';

export default angular.module('fdaFoodRecalls.filters', [])
  .filter('isRecallForState', isRecallForState)
;
