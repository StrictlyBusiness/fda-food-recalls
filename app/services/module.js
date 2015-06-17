import angular from 'angular';
import openFdaService from './open-fda-service';

export default angular.module('fdaFoodRecalls.services', [])
  .service('openFdaService', openFdaService);
