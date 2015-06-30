import angular from 'angular';
import homeRoutes from './routes';
import mapRoutes from './map/routes';

export default angular.module('fdaFoodRecalls.home', [])
  .config(homeRoutes)
  .config(mapRoutes)
;
