import angular from 'angular';
import configModule from '../app-config';
import openFdaService from './open-fda-service';
import foodRecallService from './food-recall-service';

export default angular.module('fdaFoodRecalls.services', [ configModule.name ])
  .service('openFdaService', openFdaService)
  .service('foodRecallService', foodRecallService)
;
